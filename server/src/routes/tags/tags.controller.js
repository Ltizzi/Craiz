const {
  getAllTags,
  getTagById,
  saveTag,
  updatedTag,
  deleteTag,
} = require("../../models/tags/tags.model");

const { getPagination } = require("../../services/query");

async function httpGetAllTags(req, res) {
  const { skip, limit } = getPagination(req.query);
  const tags = await getAllTags(skip, limit);
  return res.status(200).json(tags);
}

async function httpGetTagById(req, res) {
  const tagId = req.query.id;
  const tag = await getTagById(tagId);
  return res.status(200).json(tag);
}

async function httpSaveTag(req, res) {
  const tag = req.body;
  tag.createdAt = new Date.now();
  const newTag = await saveTag(tag);
  return res.status(201).json(newTag);
}

async function httpUpdateTag(req, res) {
  const tag = req.body;
  tag.updatedAt = new Date.now();
  const newTag = await updatedTag(tag);
  return res.status(200).json(newTag);
}

async function httpDeleteTag(req, res) {
  const tagId = req.query.id;
  const existTag = await getTagById(tagId);
  if (!existTag) {
    return res.status(404).json({
      error: "Tag not found!",
    });
  }
  const removed = await deleteTag(tagId);
  if (!removed) {
    return res.status(400).json({
      error: "Can't delete tag",
    });
  }
  if (removed) {
    return res.status(200).json({
      ok: "User deleted",
    });
  }
}

module.exports = {
  httpGetAllTags,
  httpGetTagById,
  httpSaveTag,
  httpUpdateTag,
  httpDeleteTag,
};
