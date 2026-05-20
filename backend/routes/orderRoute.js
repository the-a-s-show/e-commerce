import express from 'express';
import { placeOrder, getUserOrders, getAllOrders, getStripeOrders, updateOrderStatus, createStripeCheckoutSession, getOrderByStripeSessionId, createRazorpayOrder, verifyRazorpayPayment } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import { getOrderById } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', placeOrder);
orderRouter.post('/stripe-checkout', createStripeCheckoutSession);
orderRouter.post('/razorpay-order', createRazorpayOrder);
orderRouter.post('/razorpay-verify', verifyRazorpayPayment);
orderRouter.post('/user-orders', getUserOrders);
orderRouter.get('/single/:id', getOrderById);
orderRouter.get('/stripe-session/:sessionId', getOrderByStripeSessionId);
orderRouter.get('/stripe-orders', adminAuth, getStripeOrders);
orderRouter.get('/list', adminAuth, getAllOrders);
orderRouter.post('/status', adminAuth, updateOrderStatus);

export default orderRouter;
