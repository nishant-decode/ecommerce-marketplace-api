const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
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
    available: [
      {
        date: Date,
      },
    ],
    tickets: [
      {
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
        date: {
          type: Date,
          required: true,
        },
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", schema);

module.exports.Event = Event;
