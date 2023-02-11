const passport = require("passport");

async function googleAuth(req, res) {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  });
}

async function googleCallback(req, res) {
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/sucess",
    session: true,
  });
}

async function logout(req, res) {
  req.logout();
  return res.redirect("/");
}

module.exports = {
  googleAuth,
  googleCallback,
  logout,
};
