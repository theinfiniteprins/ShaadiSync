const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.model');
const Artist = require('../models/Artist.model');
const UserTransactionHistory = require('../models/UserTransactionHistory.model');
const ArtistTransactionHistory = require('../models/ArtistTransaction.model');
require("dotenv").config();

const paymentController = {
    createCheckoutSession: async (req, res) => {
        try {
            const { amount, paymentType } = req.body;
            const userId = req.id;

            let sessionConfig = {
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/wallet`,
                cancel_url: `${process.env.FRONTEND_URL}/wallet`,
            };

            switch (paymentType) {
                case 'syncCoins':
                    sessionConfig.line_items = [{
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: 'SyncCoins',
                                description: `${amount/10} SyncCoins`,
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    }];
                    sessionConfig.metadata = {
                        userId: userId.toString(),
                        syncCoins: (amount/10).toString(),
                        amount: amount.toString(),
                        paymentType: 'syncCoins'
                    };
                    break;

                case 'artistDeposit':
                    sessionConfig.line_items = [{
                        price_data: {
                            currency: 'inr',
                            product_data: {
                                name: 'Artist Account Deposit',
                                description: `Deposit ₹${amount} to artist account`,
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: 1,
                    }];
                    sessionConfig.metadata = {
                        artistId: userId.toString(),
                        amount: amount.toString(),
                        paymentType: 'artistDeposit'
                    };
                    sessionConfig.success_url = `${process.env.FRONTEND_URL}/artist/wallet`;
                    sessionConfig.cancel_url = `${process.env.FRONTEND_URL}/artist/wallet`;
                    break;

                default:
                    throw new Error('Invalid payment type');
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);
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
                const paymentType = session.metadata.paymentType;

                switch (paymentType) {
                    case 'syncCoins':
                        await handleSyncCoinsPayment(session);
                        break;
                    case 'artistDeposit':
                        await handleArtistDeposit(session);
                        break;
                }
            } catch (error) {
                console.error('Payment Processing Error:', error);
            }
        }

        res.json({ received: true });
    },

    // New method for artist withdrawal
    createWithdrawal: async (req, res) => {
        try {
            const { amount } = req.body;
            const artistId = req.id;

            const artist = await Artist.findById(artistId);
            if (!artist || artist.balance < amount) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            // Create a transaction record for withdrawal
            await ArtistTransactionHistory.create({
                artistId,
                amount: -amount,
                type: 'debit',
                description: 'Withdrawal request',
                status: 'pending'
            });

            // Update artist balance
            artist.balance -= amount;
            await artist.save();

            res.json({ message: 'Withdrawal request submitted successfully' });
        } catch (error) {
            console.error('Withdrawal Error:', error);
            res.status(500).json({ error: error.message });
        }
    }
};

// Helper functions
async function handleSyncCoinsPayment(session) {
    const userId = session.metadata.userId;
    const syncCoins = parseInt(session.metadata.syncCoins);
    const amount = parseInt(session.metadata.amount);

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.SyncCoin += syncCoins;
    await user.save();

    await UserTransactionHistory.create({
        userId,
        amount,
        syncCoin: syncCoins,
        transactionType: 'credit',
        description: `Added ${syncCoins} SyncCoins via Stripe payment id ${session.id}`,
    });
}

async function handleArtistDeposit(session) {
    const artistId = session.metadata.artistId;
    const amount = parseInt(session.metadata.amount);

    const artist = await Artist.findById(artistId);
    if (!artist) throw new Error('Artist not found');

    artist.balance = (artist.balance || 0) + amount;
    await artist.save();

    await ArtistTransactionHistory.create({
        artistId,
        amount,
        type: 'credit',
        description: 'Deposit via Stripe payment id ' + session.id 
    });
}

module.exports = paymentController;