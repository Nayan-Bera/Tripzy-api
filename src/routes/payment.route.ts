import express from 'express';
import { createPayment, handleWebhook, initiateRefund } from '../controller/v1/payment/payment.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create payment intent
router.post('/create', authenticate, createPayment);

// Handle Stripe webhooks
router.post('/webhook', handleWebhook);

// Initiate refund
router.post('/refund/:bookingId', authenticate, initiateRefund);

export default router; 