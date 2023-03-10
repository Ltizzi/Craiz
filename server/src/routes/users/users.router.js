const express = require("express");
const { checkLoggedIn, checkIsAdmin } = require("../../services/security");
const {
  httpGetAllUsers,
  httpGetSoftDeletedUsers,
  httpGetUserById,
  httpGetUserByUsername,
  httpGetUserByNickname,
  httpSaveUser,
  httpUpdateUser,
  httpDeleteUser,
  httpHandleFollows,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.get("/all", httpGetAllUsers);
usersRouter.get("/softDeleted", httpGetSoftDeletedUsers);
usersRouter.get("/byId", httpGetUserById);
usersRouter.get("/byUsername", httpGetUserByUsername);
usersRouter.get("/byNickname", httpGetUserByNickname);
usersRouter.post("/new", httpSaveUser);
usersRouter.patch("/update", checkLoggedIn, httpUpdateUser);
usersRouter.delete("/delete", checkLoggedIn, httpDeleteUser);
usersRouter.patch("/handleFollows", checkLoggedIn, httpHandleFollows);

module.exports = usersRouter;
