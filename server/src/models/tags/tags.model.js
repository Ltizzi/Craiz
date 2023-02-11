const tagsRepo = require("./tags.mongo");
const axios = require("axios");

async function getAllTags(skip, limit) {}

async function getTagById(id) {}

async function getLastTagId() {}

async function saveTag(tag) {}

async function deleteTag(id) {}

module.exports = {
  getAllTags,
  getTagById,
  getLastTagId,
  saveTag,
  deleteTag,
};
