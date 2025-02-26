const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.model');
const UserTransactionHistory = require('../models/UserTransactionHistory.model');
require("dotenv").config();

const paymentController = {
    createCheckoutSession: async (req, res) => {
        try {
            const { amount } = req.body;
            const userId = req.id; // Assuming you have user data in req.user

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: 'SyncCoins',
                                description: `${amount/10} SyncCoins`, // Display actual coin amount
                            },
                            unit_amount: amount * 100, // Convert to paise
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/wallet`, // Redirect back to wallet
                cancel_url: `${process.env.FRONTEND_URL}/wallet`,
                metadata: {
                    userId: userId.toString(),
                    syncCoins: (amount/10).toString(), // Store actual coin amount
                    amount: amount.toString()
                }
            });

            res.json({ url: session.url });
        } catch (error) {
            console.error('Checkout Session Error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    handleWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;
        
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('Webhook Error:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            try {
                const userId = session.metadata.userId;
                const syncCoins = parseInt(session.metadata.syncCoins);
                const amount = parseInt(session.metadata.amount);

                // Update user's SyncCoins directly using the User model
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                user.SyncCoin += syncCoins;
                await user.save();

                // Create transaction record
                await UserTransactionHistory.create({
                    userId,
                    amount,
                    syncCoin: syncCoins,
                    transactionType: 'credit',
                    description: `Added ${syncCoins} SyncCoins via Stripe payment id ${session.id}`,
                });
            } catch (error) {
                console.error('Payment Processing Error:', error);
            }
        }

        res.json({ received: true });
    }
};

module.exports = paymentController;