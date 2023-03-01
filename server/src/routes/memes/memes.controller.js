const {
  getAllMemes,
  getAllSoftDeletedMemes,
  getAllMemesWithoutComments,
  getAllCommentsFromAMemeById,
  getMemeById,
  getMemesByTag,
  getMemesByUser,
  getMemesByTemplate,
  saveMeme,
  deleteMeme,
  updateMeme,
  addCommentToMeme,
  likeMeme,
} = require("../../models/memes/memes.model");

const { getPagination } = require("../../services/query");

async function httpGetAllMemes(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const memes = await getAllMemes(skip, limit);
    return res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllSoftDeletedMemes(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const memes = await getAllSoftDeletedMemes(skip, limit);
    return res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllMemesWithoutComments(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const memes = await getAllMemesWithoutComments(skip, limit);
    return res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllCommentsFromMemeById(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const memeId = req.query.id;
    const comments = await getAllCommentsFromAMemeById(memeId, skip, limit);
    return res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetMemeById(req, res) {
  try {
    const memeId = req.query.id;
    const meme = await getMemeById(memeId);
    return res.status(200).json(meme);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllMemesByTag(req, res) {
  try {
    const tag = req.query.tag;
    const memes = await getMemesByTag(tag);
    return res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllMemesByTemplate(req, res) {
  try {
    const template = req.query.template;
    const memes = await getMemesByTemplate(template);
    return res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllMemesByUser(req, res) {
  try {
    const userId = req.query.user_id;
    const memes = await getMemesByUser(userId);
    return res.status(200).json(memes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err.message });
  }
}

async function httpSaveMeme(req, res) {
  try {
    const meme = req.body;
    // meme.createdAt = new Date.now();
    await saveMeme(meme);
    return res.status(201).json(meme);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function httpUpdateMeme(req, res) {
  try {
    const meme = req.body;
    // meme.updatedAt = new Date.now();
    await updateMeme(meme);
    return res.status(200).json(meme);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err.message);
  }
}

async function httpDeleteMeme(req, res) {
  try {
    const memeId = req.query.id;
    const existingMeme = await getMemeById(memeId);
    if (!existingMeme) {
      return res.status(404).json({
        error: "Meme not found",
      });
    }
    await deleteMeme(memeId);
    return res.status(200).json({ ok: "meme deleted" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function httpAddCommentToMeme(req, res) {
  try {
    const memeId = req.query.id;
    const comment = req.body;
    await addCommentToMeme(memeId, comment);
    return res.status(201).json({ ok: "Added comment!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function httpLikeMeme(req, res) {
  try {
    const memeId = req.query.memeId;
    const userId = req.query.userId;
    const response = await likeMeme(memeId, userId);
    return res.status(201).json(response);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  httpGetAllMemes,
  httpGetAllSoftDeletedMemes,
  httpGetAllMemesWithoutComments,
  httpGetAllCommentsFromMemeById,
  httpGetMemeById,
  httpGetAllMemesByTag,
  httpGetAllMemesByTemplate,
  httpGetAllMemesByUser,
  httpSaveMeme,
  httpUpdateMeme,
  httpDeleteMeme,
  httpAddCommentToMeme,
  httpLikeMeme,
};
