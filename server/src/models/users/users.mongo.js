const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  memes: [
    {
      type: mongoose.ObjectId,
      ref: "Meme",
      required: false,
    },
  ],
  likedMemes: [
    {
      type: mongoose.ObjectId,
      ref: "Meme",
      required: false,
    },
  ],
  tags: [
    {
      type: mongoose.ObjectId,
      ref: "Tag",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  softDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("User", usersSchema);
