const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", schema);

module.exports.Store = Store;
