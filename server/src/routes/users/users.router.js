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
usersRouter.get("/:id", httpGetUserById);
usersRouter.post("/new", httpSaveUser);
usersRouter.patch("/update/:id", httpUpdateUser);
usersRouter.delete("/delete/:id", httpDeleteUser);

module.exports = usersRouter;
