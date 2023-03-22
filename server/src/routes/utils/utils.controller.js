const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
require("dotenv").config();

const app = express();

const FREEIMG = {
  KEY: process.env.FREEIMG_KEY,
  URL: "https://thumbsnap.com/api/upload",
};

async function httpUploadImage(req, res) {
  const filePath = path.join(__dirname, "..", "..", "..", req.file.path);

  // const fileData = await readFileAsBlob(filePath);
  const fileData = fs.createReadStream(filePath);

  let imageData = new FormData();
  imageData.append("key", FREEIMG.KEY);
  imageData.append("media", fileData, req.file.originalname);

  try {
    const response = await axios.post(`${FREEIMG.URL}`, imageData, {
      "Content-Type": "multipart/form-data",
    });

    const imageUrl = {
      url: response.data.data.media,
    };

    fs.unlink(filePath, (error) => {
      if (error) {
        console.error(`No se pudo borrar el archivo ${filePath}: ${error}`);
      }
    });
    return res.status(200).json(imageUrl);
  } catch (err) {
    return res.status(403).json({ error: err });
  }
}

// async function readFileAsBlob(filePath) {
//   return await new Promise((resolve, reject) => {
//     fs.readFile(filePath, (error, data) => {
//       if (error) {
//         reject(error);
//       } else {
//         const blob = new Blob([data], { type: "image/jpeg" });
//         resolve(blob);
//       }
//     });
//   });
// }

module.exports = {
  httpUploadImage,
};
