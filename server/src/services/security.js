const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const { saveUser, getUserByEmail } = require("../models/users/users.model");
//const session = require("express-session");
require("dotenv").config();

const config = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SECRET_KEY_1: process.env.SESSION_SECRET_1,
  SECRET_KEY_2: process.env.SESSION_SECRET_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/v1/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  // cookie: {
  //   sameSite: "none",
  //   secure: true,
  // },
};

function checkLoggedIn(req, res, next) {
  console.log("Current user is:", req.session);
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }
  next();
}

function checkIsAdmin(req, res, next) {
  const isAdmin = req.isAdmin() && req.user;
  if (!isAdmin) {
    return res.status(403).json({
      error: "You are forbidden!",
    });
  }
  next();
}

async function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile: ", profile.id);
  const user = {
    email: profile._json.email,
    nickname: profile._json.given_name,
    avatar: "https://iili.io/HVxfJnV.png",
    googleId: profile.id,
  };
  //console.log(user);
  const alreadyUser = await getUserByEmail(user.email);
  if (!alreadyUser) {
    await saveUser(user);
  }
  const sendUser = {
    email: user.email,
    googleId: user.googleId,
  };
  done(null, sendUser);
}

//  moved from app.js and exported as setupPassport() method
function setupPassport() {
  console.log("configurando passport...");
  passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

  passport.serializeUser((user, done) => {
    console.log("serialize, user:");
    console.log(user);
    const sessionData = {
      googleId: user.googleId,
      email: user.email,
    };
    done(null, sessionData);
  });

  passport.deserializeUser((obj, done) => {
    console.log("deserializando..");
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
