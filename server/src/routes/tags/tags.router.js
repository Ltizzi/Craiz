const express = require("express");
const { checkLoggedIn, checkIsAdmin } = require("../../services/security");

const {
  httpGetAllTags,
  httpGetTagById,
  httpSaveTag,
  httpUpdateTag,
  httpDeleteTag,
} = require("./tags.controller");

const tagsRouter = express.Router();

tagsRouter.get("/all", httpGetAllTags);
tagsRouter.get("/byId", httpGetTagById);
tagsRouter.post("/new", checkLoggedIn, httpSaveTag);
tagsRouter.patch("/update", checkIsAdmin, httpUpdateTag);
tagsRouter.delete("/delete", checkIsAdmin, httpDeleteTag);

module.exports = tagsRouter;
