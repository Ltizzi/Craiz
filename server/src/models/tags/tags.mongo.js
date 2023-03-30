const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
  tagId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  class: {
    type: String,
    required: true,
  },
  isCustom: {
    type: Boolean,
    required: true,
    default: true,
  },
  description: {
    type: String,
    required: true,
  },
  counter: {
    type: Number,
    required: false,
    default: 0,
  },
  softDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("Tag", tagsSchema);
