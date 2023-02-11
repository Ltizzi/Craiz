const express = require("express");

const {
  httpGetAllMemes,
  httpGetMemeById,
  httpGetAllMemesByTag,
  httpGetAllMemesByTemplate,
  httpGetAllMemesByUser,
  httpSaveMeme,
  httpUpdateMeme,
  httpDeleteMeme,
} = require("./memes.controller");

const memesRouter = express.Router();

memesRouter.get("/", httpGetAllMemes);
memesRouter.get("/byId", httpGetMemeById);
memesRouter.get("/byTag", httpGetAllMemesByTag);
memesRouter.get("/byTemplate", httpGetAllMemesByTemplate);
memesRouter.get("/byUser", httpGetAllMemesByUser);
memesRouter.post("/new", httpSaveMeme);
memesRouter.patch("/update", httpUpdateMeme);
memesRouter.delete("/delete", httpDeleteMeme);

module.exports = memesRouter;
