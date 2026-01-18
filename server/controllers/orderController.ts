
import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

// Fix: Use 'any' for req and res to resolve property access issues with body, status, and json
export const addOrderItems = async (req: any, res: any) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    
    // Update stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(createdOrder);
  }
};

// Fix: Use 'any' for req and res to resolve property access issues with params, status, and json
export const getOrderById = async (req: any, res: any) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// Fix: Use 'any' for req and res to resolve property access issues with params, body, status, and json
export const updateOrderToPaid = async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// Fix: Use 'any' for req and res to resolve property access issues with status and json
export const getMyOrders = async (req: any, res: any) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// Fix: Use 'any' for req and res to resolve property access issues with status and json
export const getAllOrders = async (req: any, res: any) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
};

// Fix: Use 'any' for req and res to resolve property access issues with params, body, status, and json
export const updateOrderStatus = async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    if (order.status === 'delivered') {
      order.deliveredAt = new Date();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
