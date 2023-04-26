const express = require("express");
const {
  checkLoggedIn,
  checkIsAdmin,
  checkIsMod,
} = require("../../services/security");
const {
  httpGetAllUsers,
  httpGetTop10Users,
  httpGetSoftDeletedUsers,
  httpGetUserById,
  httpGetUserByUsername,
  httpGetUserByNickname,
  httpGetAllFriendsByUserId,
  httpSaveUser,
  httpUpdateUser,
  httpMakeUserAdmin,
  httpMakeUserMod,
  httpDeleteUser,
  httpHandleFollows,
  httpGetTotalUsersNumber,
  httpBanUser,
} = require("./users.controller");

const usersRouter = express.Router();

usersRouter.get("/count", checkIsAdmin, httpGetTotalUsersNumber);
usersRouter.get("/all", checkIsMod, httpGetAllUsers);
usersRouter.get("/top", httpGetTop10Users);
usersRouter.get("/softDeleted", checkIsMod, httpGetSoftDeletedUsers);
usersRouter.get("/byId", httpGetUserById);
usersRouter.get("/byUsername", httpGetUserByUsername);
usersRouter.get("/byNickname", httpGetUserByNickname);
usersRouter.get("/friends", httpGetAllFriendsByUserId);
usersRouter.get("/makeAdmin", checkIsAdmin, httpMakeUserAdmin);
usersRouter.get("/makeMod", checkIsAdmin, httpMakeUserMod);
usersRouter.post("/new", httpSaveUser);
usersRouter.patch("/update", checkLoggedIn, httpUpdateUser);
usersRouter.delete("/delete", checkLoggedIn, httpDeleteUser);
usersRouter.patch("/handleFollows", checkLoggedIn, httpHandleFollows);
usersRouter.get("/ban", checkIsMod, httpBanUser);

module.exports = usersRouter;
