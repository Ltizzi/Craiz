const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const { findUsers } = require("../../models/users/users.model");
const memesRepo = require("../../models/memes/memes.mongo");

const { getPagination } = require("../../services/query");

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
  imageData.append("media", fileStream, req.file.originalname); //en lugar de fileData

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

async function httpSearchValue(req, res) {
  const searchValue = req.query.value;
  const { skip, limit } = getPagination(req.query);

  const returnValues = {};

  const memesSortedByLike = await memesRepo
    .find(
      { softDeleted: false, tags: { $regex: searchValue, $options: "i" } },
      { _id: 0, __v: 0 }
    )
    .sort({ likeCounter: -1 })
    .skip(skip)
    .limit(limit);
  if (memesSortedByLike) returnValues.memesSortedByLike = memesSortedByLike;
  const memesSortedByUpdate = await memesRepo
    .find(
      { softDeleted: false, tags: { $regex: searchValue, $options: "i" } },
      { _id: 0, __v: 0 }
    )
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
  if (memesSortedByUpdate)
    returnValues.memesSortedByUpdate = memesSortedByUpdate;

  const searchValueRegExp = new RegExp(searchValue, "i"); //ignora mayusculas/minusculas
  const filter = {
    softDeleted: false,
    // username: { $regex: searchValue, $options: "i" },
    // nicknames: { $regex: searchValue, $options: "i" },
    $or: [{ username: searchValueRegExp }, { nickname: searchValueRegExp }],
  };
  const users = await findUsers(filter, skip, limit);
  if (users) returnValues.users = users;
  if (!memesSortedByLike && !memesSortedByUpdate && !users) {
    return res.status(400).json({ error: "No search matches" });
  }
  return res.status(200).json(returnValues);
}


module.exports = {
  httpUploadImage,
  httpSearchValue,
};
