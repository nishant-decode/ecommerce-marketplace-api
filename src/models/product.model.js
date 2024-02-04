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
    category: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    price: {
      original: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
    },
    variantAttributes: [{ 
      type: String,
    }],
    info: {
      highlights: {
        type: String,
      },
      policy: {
        type: String,
      },
    },
    details: [
      {
        detail: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    url: {
      images: [
        {
          type: String,
          required: true,
        },
      ],
      documents: [
        {
          type: String,
        },
      ],
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", schema);

module.exports.Product = Product;
