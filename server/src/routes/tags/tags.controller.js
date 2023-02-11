const {
  getAllTags,
  getTagById,
  saveTag,
  deleteTag,
} = require("../../models/tags/tags.model");

const { getPagination } = require("../../services/query");

async function httpGetAllTags(req, res) {}

async function httpGetTagById(req, res) {}

async function httpSaveTag(req, res) {}

async function httpUpdateTag(req, res) {}

async function httpDeleteTag(req, res) {}

module.exports = {
  httpGetAllTags,
  httpGetTagById,
  httpSaveTag,
  httpUpdateTag,
  httpDeleteTag,
};
