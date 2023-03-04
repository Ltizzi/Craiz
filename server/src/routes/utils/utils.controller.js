const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

const FREEIMG = {
  KEY: process.env.FREEIMG_KEY,
  URL: "http://freeimage.host/api/1/upload/",
};

app.use(bodyParser.json());

async function httpUploadImage(req, res) {
  const imageData = req.body.imageData;
  try {
    const response = await axios.post(
      `${FREEIMG.URL}?key=${FREEIMG.KEY}&source=${imageData}&format=json`
    );
    const imageUrl = {
      url: response.data.image.url,
      url_viewer: response.data.image.url_viewer,
    };
    return res.status(200).json(imageUrl);
  } catch (err) {
    return res.status(403).json({ error: err });
  }
}

module.exports = {
  httpUploadImage,
};
