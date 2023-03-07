const express = require("express");
const { checkLoggedIn, checkIsAdmin } = require("../../services/security");
const {
  httpGetAllUsers,
  httpGetSoftDeletedUsers,
  httpGetUserById,
  httpSaveUser,
  httpUpdateUser,
  httpDeleteUser,
  httpAddFriendToUser,
  httpRemoveFriendFromUser,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.get("/all", httpGetAllUsers);
usersRouter.get("/softDeleted", httpGetSoftDeletedUsers);
usersRouter.get("/byId", httpGetUserById);
usersRouter.post("/new", httpSaveUser);
usersRouter.patch("/update", checkLoggedIn, httpUpdateUser);
usersRouter.delete("/delete", checkLoggedIn, httpDeleteUser);

usersRouter.patch("/update/friends/add", httpAddFriendToUser);
usersRouter.patch("/update/friends/remove", httpRemoveFriendFromUser);

module.exports = usersRouter;
