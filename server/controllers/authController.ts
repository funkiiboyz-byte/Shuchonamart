
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'shuchonamart_secret_key_123';

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const registerUser = async (req: any, res: any) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString())
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
