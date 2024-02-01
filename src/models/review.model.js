const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviewedlistings: [
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
    videoUrl: {
      type: String,
      default: undefined,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", schema);

module.exports.Review = Review;