const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Follower = mongoose.model("Follower", schema);

module.exports.Follower = Follower;