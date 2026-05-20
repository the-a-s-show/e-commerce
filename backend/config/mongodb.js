import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("DB Connected");
    });

    const mongoUriRaw = process.env.MONGODB_URI || process.env.MONGODB_URL;
    const mongoUri = mongoUriRaw?.trim().replace(/^['"]|['"]$/g, '');

    if (!mongoUri) {
        throw new Error('MongoDB connection string is missing. Set MONGODB_URI in backend/.env.');
    }

    await mongoose.connect(`${mongoUri}/e-commerce`);
};

export default connectDB;