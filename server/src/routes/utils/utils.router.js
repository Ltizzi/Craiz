const express = require("express");
//const multer = require("multer");
const { httpUploadImage } = require("./utils.controller");

const utilsRouter = express.Router();

//const upload = multer({ dest: "uploads/" });

utilsRouter.post("/uploadImg", httpUploadImage);

module.exports = utilsRouter;
