const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["comment", "review", "post"]
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", schema);

module.exports.Report = Report;
