const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        productVariantId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        note: {
          type: String,
        },
      },
    ],
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        additionalServices: [
          {
            type: mongoose.Schema.Types.ObjectId,
          },
        ],
        note: {
          type: String,
        },
      },
    ],
    events: [
      {
        ticketId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    offerApplied: {
      type: mongoose.Schema.Types.ObjectId,
    },
    originalTotalPrice: {
      product: {
        type: Number,
      },
      services: {
        type: Number,
      },
      event: {
        type: Number,
      },
    },
    couponDiscountedAmount: {
      type: Number,
    },
    platformFee: {
      type: Number,
      default: 0.99,
    },
    shippingFee: {
      type: Number,
      default: 2.99,
    },
    totalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", schema);

module.exports.Cart = Cart;
