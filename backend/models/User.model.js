const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User Schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId; // Password only required if not Google auth
      },
    },
    googleId: {
      type: String,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: String,
      sparse: true,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    SyncCoin: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: undefined,
    },
    isBlocked: {
      type: Boolean,
      default: undefined,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    }
  },
  {
    timestamps: true,
  }
);

// Add index for Google ID

// Pre-save middleware to set isEmailVerified for Google users
userSchema.pre('save', function(next) {
  if (this.googleId && !this.isModified('googleId')) {
    this.isEmailVerified = true;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
