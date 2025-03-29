const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.model');
const Artist = require('../models/Artist.model');
const UserTransactionHistory = require('../models/UserTransactionHistory.model');
const ArtistTransactionHistory = require('../models/ArtistTransaction.model');
const mongoose = require('mongoose');
const Service = require('../models/Service.model');
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

    createWithdrawal: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { amount } = req.body;
            const artistId = req.id;

            const artist = await Artist.findById(artistId).session(session);
            if (!artist || artist.balance < amount) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            // Update artist balance first
            artist.balance -= amount;
            await artist.save({ session });

            // Create withdrawal transaction record
            await ArtistTransactionHistory.create([{
                artistId,
                amount: -amount,
                type: 'debit',
                description: 'Withdrawal request',
                status: 'pending'
            }], { session });

            // Check all live services
            const liveServices = await Service.find({ 
                artistId, 
                isLive: true 
            }).session(session);

            const deactivatedServices = [];
            let maxServicePrice = 0;

            // Check each service and update status
            for (const service of liveServices) {
                const requiredBalance = service.price * 0.1;
                if (artist.balance < requiredBalance) {
                    service.isLive = false;
                    await service.save({ session });
                    deactivatedServices.push({
                        id: service._id,
                        name: service.name,
                        price: service.price
                    });
                } else {
                    maxServicePrice = Math.max(maxServicePrice, service.price);
                }
            }

            // Update artist's maxCharge
            artist.maxCharge = maxServicePrice;
            await artist.save({ session });

            await session.commitTransaction();

            // Prepare response message
            let message = 'Withdrawal request submitted successfully';
            if (deactivatedServices.length > 0) {
                message += `. ${deactivatedServices.length} service(s) have been deactivated due to insufficient balance.`;
            }

            res.json({ 
                message,
                deactivatedServices,
                updatedBalance: artist.balance,
                newMaxCharge: maxServicePrice
            });

        } catch (error) {
            await session.abortTransaction();
            console.error('Withdrawal Error:', error);
            res.status(500).json({ error: error.message });
        } finally {
            session.endSession();
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