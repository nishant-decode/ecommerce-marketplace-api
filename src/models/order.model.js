const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    listings: [
      {
        listingId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        listingType: {
          type: String,
          required: true,
          enum: ["Product", "Service", "Event"],
        },
        status: {
          type: String,
          default: "Order Placed",
        },
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", schema);

module.exports.Order = Order;
