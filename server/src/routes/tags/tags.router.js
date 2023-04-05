const express = require("express");
const { checkLoggedIn, checkIsAdmin } = require("../../services/security");

const {
  httpGetAllTags,
  httpGetTagById,
  httpGetTagsByName,
  httpSaveTag,
  httpCreateCustomTag,
  httpUpdateTag,
  httpDeleteTag,
} = require("./tags.controller");

const tagsRouter = express.Router();

tagsRouter.get("/all", httpGetAllTags);
tagsRouter.get("/byId", httpGetTagById);
tagsRouter.get("/byName", httpGetTagsByName);
tagsRouter.post("/new", checkIsAdmin, httpSaveTag);
tagsRouter.post("/custom", checkLoggedIn, httpCreateCustomTag);
tagsRouter.patch("/update", checkIsAdmin, httpUpdateTag);
tagsRouter.delete("/delete", checkIsAdmin, httpDeleteTag);

module.exports = tagsRouter;
