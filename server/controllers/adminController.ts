
import { Request, Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import Product from '../models/Product';

// Fix: Use 'any' for req and res to resolve property access issues with status and json
export const getDashboardStats = async (req: any, res: any) => {
  const totalUsers = await User.countDocuments({});
  const totalOrders = await Order.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  
  const revenueData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
  ]);

  const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name');

  res.json({
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue: revenueData[0]?.totalRevenue || 0,
    recentOrders
  });
};

// Fix: Use 'any' for req and res to resolve property access issues with status and json
export const getUsers = async (req: any, res: any) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// Fix: Use 'any' for req and res to resolve property access issues with params, body, status, and json
export const updateUserRole = async (req: any, res: any) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = req.body.role || user.role;
    user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked;
    await user.save();
    res.json({ message: 'User updated successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
