const mongoose = require('mongoose');
const { Schema } = mongoose;

const userTransactionHistorySchema = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true, // Amount involved in the transaction
      },
      syncCoin: {
        type: Number,
        required: true, // SyncCoins associated with the transaction
      },
      transactionType: {
        type: String,
        required: true, // Type of transaction (e.g. credit, debit)
      },
      description: {
        type: String,
        required: true, // Description of the transaction
      },
      unlockId: {
        type: Schema.Types.ObjectId, // Reference to the UserUnlockArtist model
        ref: 'UserUnlockService',
        required: false,
      },
    },
    {
      timestamps: true, // Automatically include createdAt and updatedAt
    }
  );
  
  const UserTransactionHistory = mongoose.model('UserTransactionHistory', userTransactionHistorySchema);
  
  module.exports = UserTransactionHistory;
  