const express = require("express");
const usersRouter = require("./users/users.router");
const memesRouter = require("./memes/memes.router");
const tagsRouter = require("./tags/tags.router");
const authRouter = require("./auth/auth.router");
const utilsRouter = require("./utils/utils.router");
const notifsRouter = require("./notifications/notifications.router");

const apiRouter = express.Router();

apiRouter.use("/user", usersRouter);
apiRouter.use("/meme", memesRouter);
apiRouter.use("/tag", tagsRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/utils", utilsRouter);
apiRouter.use("/notifications", notifsRouter);

module.exports = apiRouter;
