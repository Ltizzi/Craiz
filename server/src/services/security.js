const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
//const session = require("express-session");
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
//  moved from app.js and exported as setupPassport() method
function setupPassport() {
  passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

  passport.serializeUser((user, done) => {
    const sessionData = {
      id: user.id,
      email: user._json.email,
    };
    done(null, sessionData);
  });

  passport.deserializeUser((obj, done) => {
    console.log(obj);
    done(null, obj);
  });
}

module.exports = {
  config,
  AUTH_OPTIONS,
  checkLoggedIn,
  checkIsAdmin,
  verifyCallback,
  setupPassport,
};
