const express = require("express");
const usersRouter = require("./users/users.router");

const apiRouter = express.Router();

apiRouter.use("/user", usersRouter);

module.exports = apiRouter;
