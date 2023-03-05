const express = require("express");
const { httpUploadImage } = require("./utils.controller");

const utilsRouter = express.Router();

utilsRouter.post("/uploadImg", httpUploadImage);

module.exports = utilsRouter;
