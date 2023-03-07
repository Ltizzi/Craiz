const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  googleId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
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
    unique: true,
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
      type: Number,
      ref: "Meme",
      required: false,
    },
  ],
  likedMemes: [
    {
      type: Number,
      ref: "Meme",
      required: false,
    },
  ],
  tags: [
    {
      type: Number,
      ref: "Tag",
      required: false,
    },
  ],
  friends: [
    {
      type: Number,
      ref: "User",
      required: false,
    },
  ],
  followers: [
    {
      type: Number,
      ref: "User",
    },
  ],
  follows: [
    {
      type: Number,
      ref: "User",
    },
  ],
  likeCounter: {
    type: Number,
    required: false,
    default: 0,
  },
  searchEntries: [
    {
      type: String,
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
