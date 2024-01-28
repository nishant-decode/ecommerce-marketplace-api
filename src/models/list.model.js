const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public"
    },
    listingType: {
      type: String,
      enum: ["Product", "Service", "Event"],
    },
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "listingType",
      },
    ],
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model("List", schema);

module.exports.List = List;
