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
  setupPassport,
} = require("./services/security");

const passport = require("passport");
const session = require("express-session");
const { sessionStore } = require("./services/mongo");

const { getUserByGoogleId } = require("./models/users/users.model");
const { Session } = require("express-session");

// moved to security.js and called back as setupPassport() method
// const { Strategy } = require("passport-google-oauth20");

require("dotenv").config();

//moved to security.js and called back as setupPassport() method
// passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// passport.serializeUser((user, done) => {
//   const sessionData = {
//     id: user.id,
//     name: user._json.name,
//     picture: user._json.picture,
//     email: user._json.email,
//   };
//   done(null, sessionData);
// });

// passport.deserializeUser((obj, done) => {
//   console.log(obj);
//   done(null, obj);
// });

//call for passport initial configuration (strategy and user serialization and deserialization)
setupPassport();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://accounts.google.com"],
    exposedHeaders: ["set-cookie"],
    credentials: true,
  })
);

app.use(
  session({
    secret: [config.SECRET_KEY_1, config.SECRET_KEY_2],
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("combined"));

app.use(express.json());

//static
// app.use(express.static(path.join(__dirname, "..", "public")));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

// app.get("/home", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "public", "index.html"));
// });

app.use("/v1", apiRouter);

//auth endpoints
app.get(
  "/v1/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/v1/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/success",
    session: true,
  }),
  (req, res) => {}
);

app.get("/v1/auth/logincheck", checkLoggedIn, async (req, res) => {
  console.log("is auth?" + req.isAuthenticated());
  const user = await getUserByGoogleId(req.user.id);
  return res.status(200).json({ user: user });
});

app.get("/success", async (req, res) => {
  console.log("Current user is:....", req.user);
  console.log(req.isAuthenticated());

  // // Call the login function from Passport
  req.login(req.user, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("usuario logueado " + req.user.id);
    res.redirect(`http://localhost:5173/home?loggedIn=true&id=${req.user.id}`);
  });
});

app.get("/failure", (req, res) => {
  res.redirect("http://localhost:5173/home?loggedIn=false");
});

module.exports = app;
