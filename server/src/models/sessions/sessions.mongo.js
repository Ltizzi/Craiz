const mongoose = require("mongoose");

const sessionsSchema = new mongoose.Schema({
  userID: {
    type: Number,
    ref: "User",
    required: true,
  },
  sessionId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", sessionsSchema);
