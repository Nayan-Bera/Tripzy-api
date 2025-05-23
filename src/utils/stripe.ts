import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (
    amount: number,
    currency: string = 'inr',
    metadata: Record<string, string> = {}
) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to smallest currency unit (paise for INR)
            currency,
            metadata,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return paymentIntent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Failed to create payment intent');
    }
};

export const createPayout = async (
    amount: number,
    destination: string,
    metadata: Record<string, string> = {}
) => {
    try {
        const transfer = await stripe.transfers.create({
            amount: amount * 100,
            currency: 'inr',
            destination,
            metadata,
        });

        return transfer;
    } catch (error) {
        console.error('Error creating payout:', error);
        throw new Error('Failed to create payout');
    }
};

export const createConnectedAccount = async (email: string, type: 'express' | 'standard' = 'express') => {
    try {
        const account = await stripe.accounts.create({
            type,
            email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: 'company',
        });

        return account;
    } catch (error) {
        console.error('Error creating connected account:', error);
        throw new Error('Failed to create connected account');
    }
};

export const createAccountLink = async (accountId: string) => {
    try {
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.FRONTEND_URL}/hotel/onboarding/refresh`,
            return_url: `${process.env.FRONTEND_URL}/hotel/onboarding/complete`,
            type: 'account_onboarding',
        });

        return accountLink;
    } catch (error) {
        console.error('Error creating account link:', error);
        throw new Error('Failed to create account link');
    }
};

export const getAccountBalance = async (accountId: string) => {
    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: accountId,
        });

        return balance;
    } catch (error) {
        console.error('Error getting account balance:', error);
        throw new Error('Failed to get account balance');
    }
};

export const createRefund = async (
    paymentIntentId: string,
    amount?: number,
    reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent'
) => {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? amount * 100 : undefined,
            reason,
        });

        return refund;
    } catch (error) {
        console.error('Error creating refund:', error);
        throw new Error('Failed to create refund');
    }
}; 