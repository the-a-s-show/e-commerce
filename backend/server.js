import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";
import { handleStripeWebhook } from "./controllers/orderController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.post('/api/order/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

    // middlewares
    app.use(express.json());
    app.use(cors());

    // api endpoint
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/cart', cartRouter);

    app.get("/", (req, res) => {
      res.send("API Working");
    });

    app.listen(port, () => {
      console.log("Server started on PORT : " + port);
    });
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    process.exit(1);
  }
};

startServer();