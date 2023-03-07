const mongoose = require("mongoose");

const memesSchema = new mongoose.Schema({
  memeId: {
    type: Number,
    required: true,
    unique: true,
  },
  uploader: {
    type: Number,
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
  likedBy: [
    {
      type: Number,
      ref: "User",
      required: false,
    },
  ],
  isComment: {
    type: Boolean,
    required: true,
    default: false,
  },
  parentMeme: {
    type: Number,
    ref: "Meme",
    required: false,
  },
  comments: [
    {
      type: Number,
      ref: "Meme",
      required: false,
    },
  ],
  isLooped: {
    type: Boolean,
    required: false,
    default: false,
  },
  loopMemeId: {
    type: Number,
    ref: "Meme",
    required: false,
  },
  looperId: {
    type: Number,
    ref: "User",
    required: false,
  },
  template: {
    type: String, // placeholder
    required: false,
  },
  tags: [
    {
      type: String,
      ref: "Tag",
      required: true,
    },
  ],
  softDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("Meme", memesSchema);
