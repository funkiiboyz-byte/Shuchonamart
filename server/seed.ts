import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import { users, categories, products } from './data/seedData';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shuchonamart';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    const createdUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    const insertedUsers = await User.insertMany(createdUsers);
    const adminUser = insertedUsers.find((user) => user.role === 'ADMIN');

    const insertedCategories = await Category.insertMany(categories);
    const categoryMap = new Map(insertedCategories.map((category) => [category.slug, category._id]));

    const productsWithCategory = products.map((product, index) => ({
      ...product,
      category: categoryMap.get(categories[index % categories.length].slug),
      createdBy: adminUser?._id
    }));

    await Product.insertMany(productsWithCategory);

    // eslint-disable-next-line no-console
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
