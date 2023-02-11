require("dotenv").config();

const config = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SECRET_KEY_1: process.env.SESSION_SECRET_1,
  SECRET_KEY_2: process.env.SESSION_SECRET_2,
};

const AUTH_OPTIONS = {
  callBackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

function checkLoggedIn(req, res, next) {
  console.log("Current user is:", req.user);
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }
  next();
}

function checkIsAdmin(req, res, next) {
  console.log("Current user is: ", req.user);
  const isAdmin = req.isAdmin() && req.user;
  if (!isAdmin) {
    return res.status(403).json({
      error: "You are forbidden!",
    });
  }
  next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile: ", profile.id);
  done(null, profile);
}

module.exports = {
  config,
  AUTH_OPTIONS,
  checkLoggedIn,
  checkIsAdmin,
  verifyCallback,
};
