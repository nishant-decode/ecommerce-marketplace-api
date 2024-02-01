const mongoose = require("mongoose");

const schema = new mongoose.Schema(
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
    //mentioned listings in the post for newsfeed
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
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", schema);

module.exportsPost = Post;
