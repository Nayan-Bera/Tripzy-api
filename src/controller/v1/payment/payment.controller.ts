import { Response } from 'express';
import { AuthenticatedRequest } from '../../../types/express';
import db from '../../../db';
import { payments } from '../../../db/schema/payments';
import { bookings } from '../../../db/schema/booking';
import { properties } from '../../../db/schema/properties';
import { eq } from 'drizzle-orm';
import {
    createPaymentIntent,
    createPayout,
    createRefund,
} from '../../../utils/stripe';
import CustomErrorHandler from '../../../Services/customErrorHandaler';

export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get booking details
        const [booking] = await db
            .select()
            .from(bookings)
            .where(eq(bookings.id, bookingId));

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Get property details for Stripe account
        const [property] = await db
            .select()
            .from(properties)
            .where(eq(properties.id, booking.propertyId));

        if (!property.stripeAccountId) {
            return res.status(400).json({ message: 'Hotel has not set up payments' });
        }

        // Create payment intent
        const paymentIntent = await createPaymentIntent(
            booking.totalAmount,
            'inr',
            {
                bookingId,
                userId,
                propertyId: booking.propertyId,
            }
        );

        // Create payment record
        const [payment] = await db
            .insert(payments)
            .values({
                bookingId,
                userId,
                amount: booking.totalAmount,
                paymentMethod: 'card',
                status: 'pending',
                paymentGateway: 'stripe',
                paymentDetails: {
                    paymentIntentId: paymentIntent.id,
                    clientSecret: paymentIntent.client_secret,
                },
            })
            .returning();

        res.json({
            message: 'Payment intent created successfully',
            data: {
                payment,
                clientSecret: paymentIntent.client_secret,
            },
        });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const handleWebhook = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const sig = req.headers['stripe-signature'];
        const event = req.body;

        // Verify webhook signature
        // Note: In production, you should verify the webhook signature
        // const verifiedEvent = stripe.webhooks.constructEvent(
        //     req.body,
        //     sig,
        //     process.env.STRIPE_WEBHOOK_SECRET
        // );

        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object);
                break;
            case 'charge.refunded':
                await handleRefund(event.data.object);
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
        const { bookingId, userId, propertyId } = paymentIntent.metadata;

        // Update payment status
        await db
            .update(payments)
            .set({
                status: 'successful',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(payments.bookingId, bookingId));

        // Update booking status
        await db
            .update(bookings)
            .set({
                status: 'confirmed',
                paymentStatus: 'paid',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(bookings.id, bookingId));

        // Create payout for hotel (after platform fee)
        const platformFee = 0.1; // 10% platform fee
        const payoutAmount = paymentIntent.amount * (1 - platformFee);

        await createPayout(
            payoutAmount,
            paymentIntent.transfer_data.destination,
            {
                bookingId,
                propertyId,
            }
        );
    } catch (error) {
        console.error('Error handling payment success:', error);
        throw error;
    }
};

const handlePaymentFailure = async (paymentIntent: any) => {
    try {
        const { bookingId } = paymentIntent.metadata;

        // Update payment status
        await db
            .update(payments)
            .set({
                status: 'failed',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(payments.bookingId, bookingId));

        // Update booking status
        await db
            .update(bookings)
            .set({
                status: 'cancelled',
                paymentStatus: 'failed',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(bookings.id, bookingId));
    } catch (error) {
        console.error('Error handling payment failure:', error);
        throw error;
    }
};

const handleRefund = async (charge: any) => {
    try {
        const paymentIntentId = charge.payment_intent;
        const [payment] = await db
            .select()
            .from(payments)
            .where(eq(payments.paymentDetails.paymentIntentId, paymentIntentId));

        if (payment) {
            // Update payment status
            await db
                .update(payments)
                .set({
                    status: 'refunded',
                    refundAmount: charge.amount_refunded / 100,
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(payments.id, payment.id));

            // Update booking status
            await db
                .update(bookings)
                .set({
                    status: 'cancelled',
                    paymentStatus: 'refunded',
                    updatedAt: new Date().toISOString(),
                })
                .where(eq(bookings.id, payment.bookingId));
        }
    } catch (error) {
        console.error('Error handling refund:', error);
        throw error;
    }
};

export const initiateRefund = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { reason } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Get booking and payment details
        const [booking] = await db
            .select()
            .from(bookings)
            .where(eq(bookings.id, bookingId));

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const [payment] = await db
            .select()
            .from(payments)
            .where(eq(payments.bookingId, bookingId));

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Create refund in Stripe
        const refund = await createRefund(
            payment.paymentDetails.paymentIntentId,
            undefined,
            reason
        );

        // Update payment status
        await db
            .update(payments)
            .set({
                status: 'refunded',
                refundAmount: booking.totalAmount,
                refundReason: reason,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(payments.id, payment.id));

        // Update booking status
        await db
            .update(bookings)
            .set({
                status: 'cancelled',
                paymentStatus: 'refunded',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(bookings.id, bookingId));

        res.json({
            message: 'Refund processed successfully',
            data: {
                refund,
                booking,
                payment,
            },
        });
    } catch (error) {
        console.error('Error processing refund:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 