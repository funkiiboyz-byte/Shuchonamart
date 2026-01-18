
import express from 'express';
import { getDashboardStats, getUsers, updateUserRole } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUserRole);

export default router;
