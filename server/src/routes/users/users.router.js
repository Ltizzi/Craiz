const express = require("express");
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
usersRouter.patch("/update", httpUpdateUser);
usersRouter.patch("/update/friends/add", httpAddFriendToUser);
usersRouter.patch("/update/friends/remove", httpRemoveFriendFromUser);
usersRouter.delete("/delete", httpDeleteUser);

module.exports = usersRouter;
