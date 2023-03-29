const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  notificationId: {
    type: Number,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  fromUser: [{ type: Object, required: true }],
  memeId: {
    type: Number,
    ref: "Meme",
    required: false,
  },
  ownerId: {
    type: Number,
    ref: "User",
    required: true,
  },
  isNewN: {
    type: Boolean,
    default: true,
    required: true,
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

module.exports = mongoose.model("Notification", notificationsSchema);
