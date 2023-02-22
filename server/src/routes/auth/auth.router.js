const express = require("express");

const { googleAuth, googleCallback, logout } = require("./auth.controller");

const authRouter = express.Router();

// authRouter.get("/google", googleAuth);
// authRouter.get("/google/callback", googleCallback);
authRouter.get("/logout", logout);
authRouter.get("/failure", (req, res) => {
  return res.send("Failed to login!");
});

module.exports = authRouter;
