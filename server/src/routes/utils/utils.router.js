const express = require("express");
const { httpUploadImage } = require("./utils.controller");

const utilsRouter = express.Router();

utilsRouter.use("/uploadImg", httpUploadImage);

module.exports = utilsRouter;
