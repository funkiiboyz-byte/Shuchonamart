import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Coupon from '../models/Coupon';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shuchonamart';

const seed = async () => {
  await mongoose.connect(MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({})
  ]);

  const password = await bcrypt.hash('Admin@123', 10);
  const [admin] = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@shuchonamart.com',
      password,
      role: 'ADMIN',
      isVerified: true
    },
    {
      name: 'Kabir Hossain',
      email: 'kabir@test.com',
      password: await bcrypt.hash('Customer@123', 10),
      role: 'CUSTOMER',
      isVerified: true
    }
  ]);

  const categories = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Home Appliances', slug: 'home-appliances' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Computers', slug: 'computers' }
  ]);

  await Product.insertMany([
    {
      name: 'Realme GT Neo 5 SE',
      slug: 'realme-gt-neo-5-se',
      description: 'Powerful performance with Snapdragon 7+ Gen 2 processor.',
      price: 32500,
      discountPrice: 29990,
      category: categories[0]._id,
      images: ['https://picsum.photos/seed/phone1/500/500'],
      stock: 50,
      sku: 'RME-GT-5SE',
      rating: 4.8,
      numReviews: 120,
      reviews: [],
      isFeatured: true,
      status: 'active',
      createdBy: admin._id
    },
    {
      name: 'Logitech G502 Hero',
      slug: 'logitech-g502-hero',
      description: 'High performance wired gaming mouse with HERO sensor.',
      price: 5500,
      discountPrice: 4800,
      category: categories[3]._id,
      images: ['https://picsum.photos/seed/mouse1/500/500'],
      stock: 15,
      sku: 'LOG-G502',
      rating: 4.9,
      numReviews: 450,
      reviews: [],
      isFeatured: true,
      status: 'active',
      createdBy: admin._id
    }
  ]);

  await Coupon.insertMany([
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minimumPurchase: 1000,
      maximumDiscount: 500
    },
    {
      code: 'FREESHIP',
      type: 'flat',
      value: 60
    }
  ]);

  console.log('Seed data inserted successfully.');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
