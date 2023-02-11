const {
  getAllMemes,
  getMemeById,
  getMemesByTag,
  getMemesByUser,
  getMemesByTemplate,
  saveMeme,
  deleteMeme,
} = require("../../models/memes/memes.model");

const { getPagination } = require("../../services/query");

async function httpGetAllMemes(req, res) {}

async function httpGetMemeById(req, res) {}

async function httpGetAllMemesByTag(req, res) {}

async function httpGetAllMemesByTemplate(req, res) {}

async function httpGetAllMemesByUser(req, res) {}

async function httpSaveMeme(req, res) {}

async function httpUpdateMeme(req, res) {}

async function httpDeleteMeme(req, res) {}

module.exports = {
  httpGetAllMemes,
  httpGetMemeById,
  httpGetAllMemesByTag,
  httpGetAllMemesByTemplate,
  httpGetAllMemesByUser,
  httpSaveMeme,
  httpUpdateMeme,
  httpDeleteMeme,
};
