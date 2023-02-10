const express = require("express");
const {
  httpGetAllTags,
  httpGetTagById,
  httpSaveTag,
  httpUpdateTag,
  httpDeleteTag,
} = require("./tags.controller");

const tagsRouter = express.Router();

tagsRouter.get("/", httpGetAllTags);
tagsRouter.get("/byId", httpGetTagById);
tagsRouter.post("/new", httpSaveTag);
tagsRouter.patch("/update", httpUpdateTag);
tagsRouter.delete("/delete", httpDeleteTag);

module.exports = tagsRouter;
