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
      required: true,
    },
    mobileNumber: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMggZhOIH1vXmnv0bCyBu8iEuYQO-Dw1kpp7_v2mwhw_SKksetiK0e4VWUak3pm-v-Moc&usqp=CAU"
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
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
