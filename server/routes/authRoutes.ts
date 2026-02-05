
import express from 'express';
import { registerUser, loginUser, requestPasswordReset, resetPassword, verifyEmail } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
