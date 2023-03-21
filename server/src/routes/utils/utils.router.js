const express = require("express");
const multer = require("multer");
const path = require("path");
const { httpUploadImage } = require("./utils.controller");

const utilsRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = ".jpg";
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});
console.log("el storage es:");
console.log(storage);
const upload = multer({ storage: storage });

utilsRouter.post("/uploadImg", upload.single("file"), httpUploadImage);

module.exports = utilsRouter;
