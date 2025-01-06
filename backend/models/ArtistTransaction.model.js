const mongoose = require('mongoose');
const { Schema } = mongoose;

const artistTransactionSchema = new Schema(
    {
      artistId: {
        type: Schema.Types.ObjectId, // Reference to the Artist model
        ref: 'Artist',
        required: true,
      },
      amount: {
        type: Number,
        required: true, // Amount involved in the transaction
      },
      type: {
        type: String,
        enum: ['credit', 'debit'], // Type of transaction: credit or debit
        required: true,
      },
      description: {
        type: String,
        default: '', // Optional description for the transaction
      },
    },
    {
      timestamps: true, // Automatically include createdAt and updatedAt
    }
  );
  
  const ArtistTransaction = mongoose.model('ArtistTransaction', artistTransactionSchema);
  
  module.exports = ArtistTransaction;
  