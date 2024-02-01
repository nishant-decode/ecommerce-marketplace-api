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
          required: true,
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
          required: true,
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
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", schema);

module.exports.Cart = Cart;
