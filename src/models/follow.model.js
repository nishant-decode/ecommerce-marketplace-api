const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    storeId: {
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

const Follow = mongoose.model("Follow", schema);

module.exports.Follow = Follow;