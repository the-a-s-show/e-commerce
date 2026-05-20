import orderModel from '../models/orderModel.js';
import stripe from '../config/stripe.js';
import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const order = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: paymentMethod === 'COD' ? false : true
    });

    await order.save();
    return res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    console.log('Error in placeOrder:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log('Error in getUserOrders:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    return res.status(200).json({ success: true, orders, total: orders.length });
  } catch (error) {
    console.log('Error in getAllOrders:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getStripeOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ $or: [{ paymentMethod: 'Stripe' }, { stripeSessionId: { $exists: true, $ne: '' } }] })
      .sort({ date: -1 });

    return res.status(200).json({ success: true, orders, total: orders.length });
  } catch (error) {
    console.log('Error in getStripeOrders:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: 'Order ID and status are required' });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.log('Error in updateOrderStatus:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export { placeOrder, getUserOrders, getAllOrders, getStripeOrders, updateOrderStatus };

const getOrderById = async (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ success: false, message: 'Order id is required' });

    const order = await orderModel.findById(id).exec();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log('Error in getOrderById:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

const createStripeCheckoutSession = async (req, res) => {
  try {
    const { items, amount, address, userId, paymentMethod } = req.body;

    if (!items || !amount || !address || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/place-order`,
      customer_email: address.email,
      currency: 'inr',
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'inr',
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: {
            name: item.name,
            description: `Size: ${item.size}`,
          },
        },
      })),
      metadata: {
        userId,
        amount: String(amount),
        paymentMethod: paymentMethod || 'Stripe',
        address: JSON.stringify(address),
        items: JSON.stringify(items),
      },
    });

    return res.status(200).json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.log('Error in createStripeCheckoutSession:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { items, amount, address, userId, paymentMethod } = req.body;

    if (!items || !amount || !address || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    });

    return res.status(200).json({
      success: true,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentMethod: paymentMethod || 'Razorpay'
    });
  } catch (error) {
    console.log('Error in createRazorpayOrder:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      items,
      amount,
      address,
      paymentMethod,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid Razorpay signature' });
    }

    const existingOrder = await orderModel.findOne({ razorpayOrderId: razorpay_order_id }).exec();
    if (existingOrder) {
      return res.status(200).json({ success: true, message: 'Payment already verified', order: existingOrder });
    }

    const order = await orderModel.create({
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || 'Razorpay',
      payment: true,
      status: 'Order Placed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    return res.status(201).json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    console.log('Error in verifyRazorpayPayment:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const getOrderByStripeSessionId = async (req, res) => {
  try {
    const sessionId = req.params.sessionId || req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session id is required' });
    }

    const order = await orderModel.findOne({ stripeSessionId: sessionId }).exec();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.log('Error in getOrderByStripeSessionId:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return res.status(500).send('Missing STRIPE_WEBHOOK_SECRET');
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (error) {
      console.log('Stripe webhook signature error:', error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};

      const stripeSessionId = session.id;
      const userId = metadata.userId;
      const amount = Number(metadata.amount || 0);
      const paymentMethod = metadata.paymentMethod || 'Stripe';

      const existingOrder = await orderModel.findOne({ stripeSessionId }).exec();

      if (!existingOrder) {
        const items = metadata.items ? JSON.parse(metadata.items) : [];
        const address = metadata.address ? JSON.parse(metadata.address) : {};

        await orderModel.create({
          userId,
          items,
          amount,
          address,
          paymentMethod,
          payment: true,
          stripeSessionId,
          status: 'Order Placed'
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.log('Error in handleStripeWebhook:', error);
    return res.status(500).send('Webhook handler failed');
  }
};

export { getOrderById, createStripeCheckoutSession, getOrderByStripeSessionId, handleStripeWebhook, createRazorpayOrder, verifyRazorpayPayment };
