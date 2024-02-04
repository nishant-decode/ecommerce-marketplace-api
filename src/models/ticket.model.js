const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    eventTimings: {
      startTime: Date,
      endTime: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", schema);

module.exports.Ticket = Ticket;
