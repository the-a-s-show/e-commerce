import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productModel from './models/productModel.js';

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing products
    await productModel.deleteMany({});
    console.log('Cleared existing products');

    // Sample products data
    const products = [
      {
        name: "Women Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 100,
        image: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        bestseller: true,
        date: new Date()
      },
      {
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 200,
        image: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        bestseller: true,
        date: new Date()
      },
      {
        name: "Girls Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 220,
        image: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "L", "XL"],
        bestseller: true,
        date: new Date()
      },
      {
        name: "Men Tapered Fit Flat-Front Trousers",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 190,
        image: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80"],
        category: "Men",
        subCategory: "Bottomwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: false,
        date: new Date()
      },
      {
        name: "Women Slim Fit Blue Jeans",
        description: "Premium quality denim jeans with a perfect fit and comfortable fabric.",
        price: 150,
        image: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"],
        category: "Women",
        subCategory: "Bottomwear",
        sizes: ["S", "M", "L"],
        bestseller: true,
        date: new Date()
      },
      {
        name: "Winter Wool Coat",
        description: "Warm and cozy winter coat made from premium wool blend fabric.",
        price: 350,
        image: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"],
        category: "Women",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L", "XL"],
        bestseller: true,
        date: new Date()
      },
      {
        name: "Men Winter Jacket",
        description: "Durable and stylish winter jacket perfect for cold weather.",
        price: 400,
        image: ["https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=80"],
        category: "Men",
        subCategory: "Winterwear",
        sizes: ["M", "L", "XL", "XXL"],
        bestseller: false,
        date: new Date()
      },
      {
        name: "Kids Warm Hoodie",
        description: "Comfortable and warm hoodie for kids in vibrant colors.",
        price: 80,
        image: ["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80"],
        category: "Kids",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L"],
        bestseller: true,
        date: new Date()
      }
    ];

    // Insert products
    await productModel.insertMany(products);
    console.log(`Successfully seeded ${products.length} products`);

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
