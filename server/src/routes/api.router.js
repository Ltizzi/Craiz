const express = require("express");
const usersRouter = require("./users/users.router");
const memesRouter = require("./memes/memes.router");
const tagsRouter = require("./tags/tags.router");

const apiRouter = express.Router();

apiRouter.use("/user", usersRouter);
apiRouter.use("/meme", memesRouter);
apiRouter.use("/tag", tagsRouter);

module.exports = apiRouter;
