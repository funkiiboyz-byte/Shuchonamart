
import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

// Fix: Use 'any' for req and res to resolve property access issues with query, status, and json
export const getProducts = async (req: any, res: any) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('category', 'name');

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// Fix: Use 'any' for req and res to resolve property access issues with params, status, and json
export const getProductById = async (req: any, res: any) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// Fix: Use 'any' for req and res to resolve property access issues with body, status, and json
export const createProduct = async (req: any, res: any) => {
  const { name, price, description, images, category, stock, sku } = req.body;

  const product = new Product({
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
    price,
    user: req.user._id,
    images,
    category,
    stock,
    sku,
    description,
    numReviews: 0
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// Fix: Use 'any' for req and res to resolve property access issues with params, body, status, and json
export const updateProduct = async (req: any, res: any) => {
  const { name, price, description, images, category, stock, status } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.status = status || product.status;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// Fix: Use 'any' for req and res to resolve property access issues with params, status, and json
export const deleteProduct = async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
