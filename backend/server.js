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

// CORS — must be before everything
const corsOptions = {
  origin: [
    'https://xor-frontend-git-main-abdus-samad-s-projects3.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ Fixed: was '*' which breaks newer path-to-regexp

// Stripe webhook — must be before express.json() (needs raw body)
app.post('/api/order/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// JSON parser — after stripe webhook
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    // API routes
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