import express from 'express';
import { getCoupons, createCoupon, updateCoupon, applyCoupon } from '../controllers/couponController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/:id').put(protect, admin, updateCoupon);
router.post('/apply', protect, applyCoupon);

export default router;
