const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Comment", "Review", "Post", "Product", "Service", "Event"],
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", schema);

module.exports.Comment = Comment;