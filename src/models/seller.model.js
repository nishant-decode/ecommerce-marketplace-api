const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
      },
    },
    storeName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: Boolean,
    type: {
      type: String,
      enum: ["Product", "Service", "Event"],
      default: "Product",
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "type",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notify: [
      {
        notification: {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        },
      },
    ],
    offers: [{
        offer: {
            name: String,
            discount: Number,
        }
    }],
    accountStatus: {
      blocked: {
        type: Boolean,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
    },
    registerOtp: {
      otp: {
        type: String,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
      attempts: {
        type: Number,
        default: undefined,
      },
    },
    resetPasswordSessions: {
      token: {
        type: String,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
    },
    sessions: {
      token: {
        type: String,
        default: undefined,
      },
      expiresAt: {
        type: Number,
        default: undefined,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports.Seller = Seller;
