
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();

const app = express();

// Security & Middleware
// Fix: cast express.json() to any to bypass path parameter overload mismatch in certain environments
app.use(express.json() as any);
// Fix: cast cors() to any to ensure consistency with middleware application
app.use(cors() as any);
app.use(helmet() as any);
app.use(mongoSanitize() as any);
app.use(xssClean() as any);
app.use(hpp() as any);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(notFound);
app.use(errorHandler);

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shuchonamart';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
