const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    variant: [
      {
        attribute: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    price: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    notify: [
      {
        notification: {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductVariant = mongoose.model("ProductVariant", schema);

module.exports.ProductVariant = ProductVariant;
