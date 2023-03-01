const express = require("express");

const {
  httpGetAllMemes,
  httpGetAllSoftDeletedMemes,
  httpGetAllMemesWithoutComments,
  httpGetAllCommentsFromMemeById,
  httpGetMemeById,
  httpGetAllMemesByTag,
  httpGetAllMemesByTemplate,
  httpGetAllMemesByUser,
  httpSaveMeme,
  httpUpdateMeme,
  httpDeleteMeme,
  httpAddCommentToMeme,
  httpLikeMeme,
} = require("./memes.controller");

const memesRouter = express.Router();

memesRouter.get("/", httpGetAllMemes);
memesRouter.get("/softDeleted", httpGetAllSoftDeletedMemes);
memesRouter.get("/allWoC", httpGetAllMemesWithoutComments);
memesRouter.get("/getCommentsById", httpGetAllCommentsFromMemeById);
memesRouter.get("/byId", httpGetMemeById);
memesRouter.get("/byTag", httpGetAllMemesByTag);
memesRouter.get("/byTemplate", httpGetAllMemesByTemplate);
memesRouter.get("/byUser", httpGetAllMemesByUser);
memesRouter.post("/new", httpSaveMeme);
memesRouter.post("/comment", httpAddCommentToMeme);
memesRouter.post("/like", httpLikeMeme);
memesRouter.patch("/update", httpUpdateMeme);
memesRouter.delete("/delete", httpDeleteMeme);

module.exports = memesRouter;
