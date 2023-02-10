const express = require("express");
const {
  httpGetAllUsers,
  httpGetUserById,
  httpSaveUser,
  httpUpdateUser,
  httpDeleteUser,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.get("/all", httpGetAllUsers);
usersRouter.get("/byId", httpGetUserById);
usersRouter.post("/new", httpSaveUser);
usersRouter.patch("/update", httpUpdateUser);
usersRouter.delete("/delete", httpDeleteUser);

module.exports = usersRouter;
