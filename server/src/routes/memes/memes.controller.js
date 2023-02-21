const {
  getAllMemes,
  getMemeById,
  getMemesByTag,
  getMemesByUser,
  getMemesByTemplate,
  saveMeme,
  deleteMeme,
  updateMeme,
  addCommentToMeme,
} = require("../../models/memes/memes.model");

const { getPagination } = require("../../services/query");

async function httpGetAllMemes(req, res) {
  const { skip, limit } = getPagination(req.query);
  const memes = await getAllMemes(skip, limit);
  return res.status(200).json(memes);
}

async function httpGetMemeById(req, res) {
  const memeId = req.query.id;
  const meme = await getMemeById(memeId);
  return res.status(200).json(meme);
}

async function httpGetAllMemesByTag(req, res) {
  const tag = req.query.tag;
  const memes = await getMemesByTag(tag);
  return res.status(200).json(memes);
}

async function httpGetAllMemesByTemplate(req, res) {
  const template = req.query.template;
  const memes = await getMemesByTemplate(template);
  return res.status(200).json(memes);
}

async function httpGetAllMemesByUser(req, res) {
  const userId = req.query.user_id;
  const memes = await getMemesByUser(userId);
  return res.status(200).json(memes);
}

async function httpSaveMeme(req, res) {
  const meme = req.body;
  // meme.createdAt = new Date.now();
  await saveMeme(meme);
  return res.status(201).json(meme);
}

async function httpUpdateMeme(req, res) {
  const meme = req.body;
  // meme.updatedAt = new Date.now();
  await updateMeme(meme);
  return res.status(200).json(meme);
}

async function httpDeleteMeme(req, res) {
  const memeId = req.query.id;
  const existingMeme = await getMemeById(memeId);
  if (!existingMeme) {
    return res.status(404).json({
      error: "Meme not found",
    });
  }
  const removed = await deleteMeme(memeId);
  if (!removed) {
    return res.status(400).json({
      error: "Can't delete meme",
    });
  }
  if (deleted) {
    return res.status(200).json({
      ok: "Meme deleted!",
    });
  }
}

async function httpAddCommentToMeme(req, res) {
  try {
    const memeId = req.query.id;
    const comment = req.body;
    await addCommentToMeme(memeId, comment);
    return res.status(201).json({ ok: "Added comment!" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  httpGetAllMemes,
  httpGetMemeById,
  httpGetAllMemesByTag,
  httpGetAllMemesByTemplate,
  httpGetAllMemesByUser,
  httpSaveMeme,
  httpUpdateMeme,
  httpDeleteMeme,
  httpAddCommentToMeme,
};
