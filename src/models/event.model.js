const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    price: {
      original: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
      },
    },
    info: {
      highlights: {
        type: String,
      },
      policy: {
        type: String,
      },
    },
    details: [
      {
        detail: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    url: {
      images: [
        {
          type: String,
          required: true,
        },
      ],
      documents: [
        {
          type: String,
        },
      ],
    },
    slotsAvailable: [
      {
        startTime: Date,
        endTime: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", schema);

module.exports.Event = Event;
