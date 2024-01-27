const mongoose = require("mongoose");

const newsfeedSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Seller",
    },
    content: {
      type: String,
      required: true,
    },
    url: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reports: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
        },
      },
    ],
    listing: {
      type: String,
      enum: ["Product", "Service", "Event"],
    },
    listingId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "orderType",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Newsfeed = mongoose.model("Newsfeed", newsfeedSchema);

module.exports.Newfeed = Newsfeed;
