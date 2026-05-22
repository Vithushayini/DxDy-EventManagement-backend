import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js'
import { protect } from '../middleware/authMiddleware.js';

// All user routes require authentication
router.use(protect);

// User profile routes
router.get('/me', userController.getMe);
router.patch('/update-profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);

// Email change routes - Add these new routes
router.post('/send-email-change-otp', userController.sendEmailChangeOTP);
router.post('/verify-email-change-otp', userController.verifyEmailChangeOTP);


export default router;