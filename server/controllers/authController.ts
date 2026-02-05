
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import EmailVerificationToken from '../models/EmailVerificationToken';
import PasswordResetToken from '../models/PasswordResetToken';
import { generateTokenPair, hashToken } from '../utils/tokenUtils';
import { sendEmail } from '../utils/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'shuchonamart_secret_key_123';

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const registerUser = async (req: any, res: any) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

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
    const { rawToken, hashedToken } = generateTokenPair();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await EmailVerificationToken.create({
      user: user._id,
      token: hashedToken,
      expiresAt
    });

    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}`;
    await sendEmail(user.email, 'Verify your ShuchonaMart account', `Verify your email: ${verificationUrl}`);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
      verificationRequired: true,
      verificationUrl: process.env.NODE_ENV !== 'production' ? verificationUrl : undefined
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Fix: Use 'any' for req and res to bypass incorrect type mapping for body and status/json
export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account is blocked' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
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

export const verifyEmail = async (req: any, res: any) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  const lookupToken = hashToken(token);
  const verificationToken = await EmailVerificationToken.findOne({ token: lookupToken });
  if (!verificationToken) {
    return res.status(400).json({ message: 'Verification token is invalid or expired.' });
  }

  const user = await User.findById(verificationToken.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (user.isVerified) {
    await verificationToken.deleteOne();
    return res.json({ message: 'Email already verified.' });
  }

  user.isVerified = true;
  await user.save();
  await verificationToken.deleteOne();

  res.json({ message: 'Email verified successfully.' });
};

export const requestPasswordReset = async (req: any, res: any) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If the email exists, a reset link has been sent.' });
  }

  const { rawToken, hashedToken } = generateTokenPair();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await PasswordResetToken.deleteMany({ user: user._id });
  await PasswordResetToken.create({
    user: user._id,
    token: hashedToken,
    expiresAt
  });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
  await sendEmail(user.email, 'Reset your ShuchonaMart password', `Reset your password: ${resetUrl}`);

  res.json({
    message: 'If the email exists, a reset link has been sent.',
    resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined
  });
};

export const resetPassword = async (req: any, res: any) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  const hashedToken = hashToken(token);
  const resetToken = await PasswordResetToken.findOne({ token: hashedToken });

  if (!resetToken) {
    return res.status(400).json({ message: 'Reset token is invalid or expired.' });
  }

  const user = await User.findById(resetToken.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();
  await resetToken.deleteOne();

  res.json({ message: 'Password reset successfully.' });
};
