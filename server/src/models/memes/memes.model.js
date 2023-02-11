const memesRepo = require("./memes.mongo");
const axios = require("axios");

async function getAllMemes(skip, limit) {}

async function getMemesByUser(id) {}

async function getMemesByTag(tag) {}

async function getMemesByTemplate(template) {}

async function getMemeById(id) {}

async function getLastMemeId() {}

async function saveMeme(meme) {}

async function deleteMeme(id) {}

module.exports = {
  getAllMemes,
  getMemeById,
  getMemesByTag,
  getMemesByUser,
  getMemesByTemplate,
  getLastMemeId,
  saveMeme,
  deleteMeme,
};
