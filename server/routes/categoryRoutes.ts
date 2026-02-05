import express from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(getCategories).post(protect, admin, createCategory);
router.route('/:id').put(protect, admin, updateCategory).delete(protect, admin, deleteCategory);

export default router;
