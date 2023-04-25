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
  banner: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  facebook: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  youtube: {
    type: String,
    required: false,
  },
  twitch: {
    type: String,
    required: false,
  },
  siteUrl: {
    type: String,
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  // roles: [
  //   {
  //     type: String,
  //     required: true,
  //   },
  // ],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isMod: {
    type: Boolean,
    required: false,
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
      type: String,
      ref: "Tag",
      required: false,
    },
  ],
  followers: [
    {
      type: Number,
      ref: "User",
    },
  ],
  // followers: [
  //   {
  //     type: Object,
  //     ref: "User",
  //     required: false,
  //   },
  // ],
  followersCounter: {
    type: Number,
    default: 0,
  },
  follows: [
    {
      type: Number,
      ref: "User",
    },
  ],
  // follows: [
  //   {
  //     type: Object,
  //     ref: "User",
  //     required: false,
  //   },
  // ],
  followsCounter: {
    type: Number,
    default: 0,
  },
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
