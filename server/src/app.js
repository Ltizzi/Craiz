const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const apiRouter = require("./routes/api.router");

const {
  config,
  AUTH_OPTIONS,
  checkLoggedIn,
  checkIsAdmin,
  verifyCallback,
} = require("./services/security");

const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const session = require("express-session");

require("dotenv").config();

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

const app = express();

app.use(helmet());

app.use(
  session({
    secret: [config.SECRET_KEY_1, config.SECRET_KEY_2],
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(morgan("combined"));

app.use(express.json());

app.use("/v1", apiRouter);

module.exports = app;
