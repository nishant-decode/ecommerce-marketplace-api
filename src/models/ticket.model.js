const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", schema);

module.exports.Ticket = Ticket;
