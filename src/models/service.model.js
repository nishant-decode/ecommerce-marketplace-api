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
    providerAddress: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    locationsAvailable: [
      {
        option: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
        },
      },
    ],
    slotsAvailable: [
      {
        startTime: Date,
        endTime: Date,
      },
    ],
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
    additionalServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", schema);

module.exports.Service = Service;
