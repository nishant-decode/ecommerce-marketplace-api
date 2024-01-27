const mongoose = require("mongoose");

const listSchema = mongoose.Schema(
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

const List = mongoose.model("List", listSchema);

module.exports.List = List;
