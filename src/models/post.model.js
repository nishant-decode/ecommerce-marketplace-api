const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
          enum: ['product','service','event'],
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

module.exports.Post = Post;
