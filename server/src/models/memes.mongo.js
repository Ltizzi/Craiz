const mongoose = require("mongoose");

const memesSchema = new mongoose.Schema({
  memeId: {
    type: Number,
    required: true,
  },
  uploader: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
  isComment: {
    type: Boolean,
    required: true,
    default: false,
  },
  comments: [
    {
      type: mongoose.ObjectId,
      ref: "Meme",
      required: false,
    },
  ],
  template: {
    type: String, // placeholder
    required: false,
  },
  tags: [
    {
      type: mongoose.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
});

module.exports = mongoose.model("Meme", memesSchema);
