const express = require("express");
const usersRouter = require("./users/users.router");
const memesRouter = require("./memes/memes.router");
const tagsRouter = require("./tags/tags.router");
const authRouter = require("./auth/auth.router");

const apiRouter = express.Router();

apiRouter.use("/user", usersRouter);
apiRouter.use("/meme", memesRouter);
apiRouter.use("/tag", tagsRouter);
apiRouter.use("/auth", authRouter);

module.exports = apiRouter;
