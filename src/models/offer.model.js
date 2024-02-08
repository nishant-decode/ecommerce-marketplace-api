const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    offerType: {
      type: String,
      enum: ["ComboOffer", "AllListingsIncluded"],
      required: true,
    },
    offerName: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    minValueCondition: {
      type: Number,
      default: 0,
    },
    maxOfferValue: {
      type: Number,
    },
    listings: {
      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      services: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
      ],
      events: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", schema);

module.exports.Offer = Offer;
