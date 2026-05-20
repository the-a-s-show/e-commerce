import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true }
    }
  ],
  amount: { type: Number, required: true },
  address: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: { type: String, default: "Order Placed", enum: ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"] },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  stripeSessionId: { type: String, sparse: true },
  razorpayOrderId: { type: String, sparse: true },
  razorpayPaymentId: { type: String, sparse: true },
  razorpaySignature: { type: String },
  date: { type: Date, default: Date.now }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
