const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

const FREEIMG = {
  KEY: process.env.FREEIMG_KEY,
  URL: "https://thumbsnap.com/api/upload",
};

app.use(bodyParser.json());

async function httpUploadImage(req, res) {
  const image = req.file;
  let imageData = new FormData();
  imageData.append("key", FREEIMG.KEY);
  imageData.append("media", req.file);

  // try {

  const response = await axios.post(`${FREEIMG.URL}`, imageData, {
    "Content-Type": "multipart/form-data",
  });

  console.log(response.data);
  const imageUrl = {
    url: response.data.media,
  };
  return res.status(200).json(imageUrl);
  // } catch (err) {
  //   return res.status(403).json({ error: err });
  // }
}

module.exports = {
  httpUploadImage,
};
