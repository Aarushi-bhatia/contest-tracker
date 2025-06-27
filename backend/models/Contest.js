const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ["Codeforces", "CodeChef", "LeetCode"],
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    solutionUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contest', contestSchema)