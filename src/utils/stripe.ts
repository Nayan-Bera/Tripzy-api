// import Stripe from 'stripe';
// import { db } from '../db';
// import { payments, bookings } from '../db/schema';
// import { eq } from 'drizzle-orm';
// import { createNotification } from './notification';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: '2023-10-16'
// });

// export const createPaymentIntent = async (
//     bookingId: string,
//     amount: number,
//     currency: string = 'usd'
// ): Promise<Stripe.PaymentIntent> => {
//     try {
//         const booking = await db.query.bookings.findFirst({
//             where: eq(bookings.id, bookingId),
//             with: {
//                 user: true,
//                 room: true,
//                 property: true
//             }
//         });

//         if (!booking) {
//             throw new Error('Booking not found');
//         }

//         // Create payment record
//         const payment = await db.insert(payments)
//             .values({
//                 bookingId,
//                 userId: booking.userId,
//                 amount,
//                 currency,
//                 status: 'pending',
//                 paymentMethod: 'card',
//                 paymentGateway: 'stripe',
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             })
//             .returning();

//         // Create Stripe payment intent
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: Math.round(amount * 100), // Convert to cents
//             currency,
//             metadata: {
//                 bookingId,
//                 paymentId: payment[0].id,
//                 userId: booking.userId
//             },
//             description: `Booking payment for ${booking.property.name} - Room ${booking.room.roomNumber}`
//         });

//         // Update payment record with Stripe payment intent ID
//         await db.update(payments)
//             .set({
//                 paymentDetails: {
//                     paymentIntentId: paymentIntent.id,
//                     clientSecret: paymentIntent.client_secret
//                 },
//                 updatedAt: new Date()
//             })
//             .where(eq(payments.id, payment[0].id));

//         return paymentIntent;
//     } catch (error) {
//         console.error('Error creating payment intent:', error);
//         throw error;
//     }
// };

// export const handleStripeWebhook = async (event: Stripe.Event): Promise<void> => {
//     try {
//         switch (event.type) {
//             case 'payment_intent.succeeded':
//                 await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
//                 break;

//             case 'payment_intent.payment_failed':
//                 await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
//                 break;

//             case 'charge.refunded':
//                 await handleRefund(event.data.object as Stripe.Charge);
//                 break;
//         }
//     } catch (error) {
//         console.error('Error handling Stripe webhook:', error);
//         throw error;
//     }
// };

// const handlePaymentSuccess = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
//     const { bookingId, paymentId, userId } = paymentIntent.metadata;

//     // Update payment status
//     await db.update(payments)
//         .set({
//             status: 'completed',
//             paymentDetails: {
//                 ...paymentIntent,
//                 completedAt: new Date()
//             },
//             updatedAt: new Date()
//         })
//         .where(eq(payments.id, paymentId));

//     // Update booking status
//     await db.update(bookings)
//         .set({
//             status: 'confirmed',
//             updatedAt: new Date()
//         })
//         .where(eq(bookings.id, bookingId));

//     // Notify user
//     await createNotification({
//         userId,
//         type: 'payment_success',
//         title: 'Payment Successful',
//         message: 'Your booking payment has been processed successfully',
//         data: { bookingId, paymentId }
//     });
// };

// const handlePaymentFailure = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
//     const { bookingId, paymentId, userId } = paymentIntent.metadata;

//     // Update payment status
//     await db.update(payments)
//         .set({
//             status: 'failed',
//             paymentDetails: {
//                 ...paymentIntent,
//                 failedAt: new Date()
//             },
//             updatedAt: new Date()
//         })
//         .where(eq(payments.id, paymentId));

//     // Notify user
//     await createNotification({
//         userId,
//         type: 'payment_failed',
//         title: 'Payment Failed',
//         message: 'Your booking payment could not be processed',
//         data: { bookingId, paymentId }
//     });
// };

// const handleRefund = async (charge: Stripe.Charge): Promise<void> => {
//     const payment = await db.query.payments.findFirst({
//         where: eq(payments.id, charge.metadata.paymentId)
//     });

//     if (!payment) {
//         throw new Error('Payment not found');
//     }

//     // Update payment status
//     await db.update(payments)
//         .set({
//             status: 'refunded',
//             refundAmount: charge.amount_refunded / 100, // Convert from cents
//             refundDetails: {
//                 chargeId: charge.id,
//                 refundedAt: new Date()
//             },
//             updatedAt: new Date()
//         })
//         .where(eq(payments.id, payment.id));

//     // Notify user
//     await createNotification({
//         userId: payment.userId,
//         type: 'payment_refunded',
//         title: 'Payment Refunded',
//         message: 'Your payment has been refunded',
//         data: { paymentId: payment.id }
//     });
// };

// export const createConnectedAccount = async (
//     email: string,
//     type: 'express' | 'standard' = 'express'
// ): Promise<Stripe.Account> => {
//     try {
//         return await stripe.accounts.create({
//             type,
//             email,
//             capabilities: {
//                 card_payments: { requested: true },
//                 transfers: { requested: true }
//             }
//         });
//     } catch (error) {
//         logger.error('Error creating connected account:', error);
//         throw new Error('Failed to create connected account');
//     }
// };

// export const createAccountLink = async (
//     accountId: string,
//     refreshUrl: string,
//     returnUrl: string
// ): Promise<Stripe.AccountLink> => {
//     try {
//         return await stripe.accountLinks.create({
//             account: accountId,
//             refresh_url: refreshUrl,
//             return_url: returnUrl,
//             type: 'account_onboarding'
//         });
//     } catch (error) {
//         logger.error('Error creating account link:', error);
//         throw new Error('Failed to create account link');
//     }
// };

// export const createPayout = async (
//     amount: number,
//     currency: string = 'inr',
//     destination: string,
//     metadata: any = {}
// ): Promise<Stripe.Payout> => {
//     try {
//         return await stripe.payouts.create({
//             amount,
//             currency,
//             destination,
//             metadata
//         });
//     } catch (error) {
//         logger.error('Error creating payout:', error);
//         throw new Error('Failed to create payout');
//     }
// };

// export const createRefund = async (
//     paymentIntentId: string,
//     amount?: number,
//     reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent'
// ): Promise<Stripe.Refund> => {
//     try {
//         return await stripe.refunds.create({
//             payment_intent: paymentIntentId,
//             amount,
//             reason
//         });
//     } catch (error) {
//         logger.error('Error creating refund:', error);
//         throw new Error('Failed to create refund');
//     }
// };

// export default stripe; 