
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'shuchonamart_secret_key_123';

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

const generateHashedToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken };
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
    const { rawToken, hashedToken } = generateHashedToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
      emailVerificationToken: process.env.NODE_ENV === 'production' ? undefined : rawToken
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
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email to continue' });
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

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const requestPasswordReset = async (req: any, res: any) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'No account found with that email' });
  }

  const { rawToken, hashedToken } = generateHashedToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60);
  await user.save();

  res.json({ message: 'Password reset token generated', resetToken: process.env.NODE_ENV === 'production' ? undefined : rawToken });
};

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const resetPassword = async (req: any, res: any) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Reset token is invalid or expired' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const verifyEmail = async (req: any, res: any) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Verification token is invalid or expired' });
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully' });
};
