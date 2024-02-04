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
    allListingsIncluded: {
      type: Boolean,
      default: false,
      required: true,
    },
    comboOffer: {
      type: Boolean,
      default: false,
      required: true,
    },
    listings: [
      {
        listingType: {
          type: String,
          required: true,
        },
        listingId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
    minAmountCondition: {
      type: Number,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = mongoose.model("Offer", schema);

module.exports.Offer = Offer;
