import express from 'express';
import { paymentVerification, processPayment, sendAPIKey } from '../controller/payment.controller.js';
import { authenticateUser } from '../middleware/auth.user.js';

const router = express.Router();

router.route('/process/payment').post(authenticateUser, processPayment);
router.route('/getKey').get(authenticateUser, sendAPIKey);
router.route('/payment-verification').post(paymentVerification);

export default router;