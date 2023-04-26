const express = require("express");
const {
  checkLoggedIn,
  checkIsAdmin,
  checkIsMod,
} = require("../../services/security");

const {
  httpGetAllMemes,
  httpGetAllSoftDeletedMemes,
  httpGetAllMemesWithoutComments,
  httpGetAllCommentsFromMemeById,
  httpGetMemeById,
  httpGetAllMemesByTag,
  httpGetAllMemesByTemplate,
  httpGetAllMemesByUser,
  httpGetUserMemesWoC,
  httpGetUserComments,
  httpGetUserLoopedMemes,
  httpGetUserLikedMemes,
  httpSaveMeme,
  httpUpdateMeme,
  httpDeleteMeme,
  httpAddCommentToMeme,
  httpLikeMeme,
  httpLoopMeme,
  httpGetTotalMemesNumber,
  httpFlagMeme,
  httpGetAllFlaggedMemes,
  httpModDeleteMeme,
  httpAdminDeleteMeme,
  httpModReviewMeme,
  httpGetTotalFlaggedMemesNumber,
  httpGetTotalModeratedMemesNumber,
} = require("./memes.controller");

const memesRouter = express.Router();

memesRouter.get("/count", checkIsAdmin, httpGetTotalMemesNumber);
memesRouter.get("/countFlagged", checkIsMod, httpGetTotalFlaggedMemesNumber);
memesRouter.get("/countMod", checkIsMod, httpGetTotalModeratedMemesNumber);
memesRouter.get("/", httpGetAllMemes);
memesRouter.get("/softDeleted", checkIsMod, httpGetAllSoftDeletedMemes);
memesRouter.get("/allWoC", httpGetAllMemesWithoutComments);
memesRouter.get("/getCommentsById", httpGetAllCommentsFromMemeById);
memesRouter.get("/byId", httpGetMemeById);
memesRouter.get("/byTag", httpGetAllMemesByTag);
memesRouter.get("/byTemplate", httpGetAllMemesByTemplate);
memesRouter.get("/byUser", httpGetAllMemesByUser);
memesRouter.get("/byUserWoC", httpGetUserMemesWoC);
memesRouter.get("/byUserComments", httpGetUserComments);
memesRouter.get("/byUserLoopedMemes", httpGetUserLoopedMemes);
memesRouter.get("/byUserLikedMemes", httpGetUserLikedMemes);
memesRouter.post("/new", checkLoggedIn, httpSaveMeme);
memesRouter.post("/comment", checkLoggedIn, httpAddCommentToMeme);
memesRouter.post("/like", checkLoggedIn, httpLikeMeme);
memesRouter.post("/loop", checkLoggedIn, httpLoopMeme);
memesRouter.patch("/update", checkLoggedIn, httpUpdateMeme);
memesRouter.delete("/delete", checkLoggedIn, httpDeleteMeme);
memesRouter.get("/flag", checkLoggedIn, httpFlagMeme);
memesRouter.get("/getAllFlagged", checkIsMod, httpGetAllFlaggedMemes);
memesRouter.delete("/modDelete", checkIsMod, httpModDeleteMeme);
memesRouter.get("/review", checkIsMod, httpModReviewMeme);
memesRouter.delete("/adminDelete", checkIsAdmin, httpAdminDeleteMeme);

module.exports = memesRouter;
