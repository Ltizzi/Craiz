const express = require("express");
const { checkLoggedIn } = require("../../services/security");

const {
  httpCheckNotificationAsView,
  httpGetNewNotificationsByUserId,
  httpGetNotificationsByUserId,
} = require("./notifications.controller");

const notificationsRouter = express.Router();

notificationsRouter.get(
  "/byUserId",
  checkLoggedIn,
  httpGetNotificationsByUserId
);
notificationsRouter.get(
  "/newByUserId",
  checkLoggedIn,
  httpGetNewNotificationsByUserId
);
notificationsRouter.post("/check", checkLoggedIn, httpCheckNotificationAsView);

module.exports = notificationsRouter;
