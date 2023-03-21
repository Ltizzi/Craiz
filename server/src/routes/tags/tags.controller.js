const {
  getAllTags,
  getTagById,
  saveTag,
  updateTag,
  deleteTag,
} = require("../../models/tags/tags.model");

const { getPagination } = require("../../services/query");

async function httpGetAllTags(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const tags = await getAllTags(skip, limit);
    return res.status(200).json(tags);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetTagById(req, res) {
  const tagId = req.query.id;
  try {
    const tag = await getTagById(tagId);
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function httpSaveTag(req, res) {
  // tag.createdAt = Date.now();
  try {
    const tag = req.body;
    const newTag = await saveTag(tag);
    return res.status(201).json(tag);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function httpUpdateTag(req, res) {
  // tag.updatedAt = Date.now();
  try {
    const tag = req.body;
    const newTag = await updateTag(tag);
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
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
      ok: "Tag deleted",
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
