const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    orderType: {
      type: String,
      required: true,
      enum: ["Product", "Service", "Event"],
    },
    listingId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "orderType",
        required: true,
      },
    ],
    status: {
      type: String,
      default: "Order Placed",
    },
    address: {
      type: String,
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

const Order = mongoose.model("Order", orderSchema);

module.exports.Order = Order;