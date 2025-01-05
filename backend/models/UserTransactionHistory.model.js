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
    },
    {
      timestamps: true, // Automatically include createdAt and updatedAt
    }
  );
  
  const UserTransactionHistory = mongoose.model('UserTransactionHistory', userTransactionHistorySchema);
  
  module.exports = UserTransactionHistory;
  