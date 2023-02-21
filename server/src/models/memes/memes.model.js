const memesRepo = require("./memes.mongo");
const { getUserById, updateUser } = require("../users/users.model");
//const axios = require("axios");

const DEFAULT_MEME_ID = 0;

async function getAllMemes(skip, limit) {
  return await memesRepo
    .find({ softDeleted: false }, { _id: 0, __v: 0 })
    .sort({ memeId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getMemesByUser(user_id, skip, limit) {
  return await findMemes(
    { uploader: user_id, softDeleted: false },
    skip,
    limit
  );
}

async function getMemesByTag(tag, skip, limit) {
  return await findMemes({ tags: tag, softDeleted: false }, skip, limit);
}

async function getMemesByTemplate(template, skip, limit) {
  return await findMemes(
    { template: template, softDeleted: false },
    skip,
    limit
  );
}

async function getMemeById(id) {
  return await findMeme({ memeId: id, softDeleted: false });
}

async function getLastMemeId() {
  const lastMeme = await memesRepo.findOne().sort("-memeId");
  if (!lastMeme) {
    return DEFAULT_MEME_ID;
  }
  return lastMeme.memeId;
}

async function saveMeme(meme) {
  const newMemeId = (await getLastMemeId()) + 1;
  const user = await getUserById(meme.uploader);
  const newMeme = Object.assign(meme, {
    memeId: newMemeId,
    likes: 0,
    createdAt: Date.now(),
  });

  const savedMeme = await memesRepo.findOneAndUpdate(
    { memeId: newMeme.memeId },
    newMeme,
    {
      upsert: true,
    }
  );
  user.memes.push(newMemeId);
  await updateUser(user);
  return savedMeme;
}

async function addCommentToMeme(memeId, comment) {
  const meme = await findMeme({ memeID: memeId });
  if (!meme) {
    throw new Error("Parent meme not found!");
  }
  comment.isComment = true;
  comment.parentMeme = memeId;
  const uploadedComment = await saveMeme(comment);
  meme.comments.push(comment.memeId);
  await updateMeme(meme);
  return uploadedComment;
}

async function updateMeme(meme) {
  meme.updatedAt = Date.now();
  return await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
    upsert: true,
  });
}

async function deleteMeme(id) {
  const softDeleted = await memesRepo.updateOne(
    { memeId: id },
    { softDeleted: true, updatedAt: new Date.now() }
  );
  return softDeleted.acknowledged === true && softDeleted.modifiedCount === 1;
}

async function likeMeme(memeId, userId) {
  const meme = await getMemeById(memeId);
  if (!meme) {
    throw new Error("Meme doesn't exists");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User doesn0t exists");
  }
  const likedMeme = user.likedMemes.filter((mem) => mem == memeId);
  console.log(likedMeme);
  if (likedMeme.length == 0) {
    meme.likedBy.push(user.userId);
    user.likedMemes.push(meme.memeId);
    await updateMeme(meme);
    await updateUser(user);
    return { ok: "liked meme" };
  } else {
    meme.likedBy = meme.likedBy.filter((usr) => usr != userId);
    user.likedMemes = user.likedMemes.filter((mm) => mm != memeId);
    await updateMeme(meme);
    await updateUser(user);
    return { ok: "unliked meme" };
  }
}

async function findMeme(filter) {
  return await memesRepo.findOne(filter, { _id: 0, __v: 0 });
}

async function findMemes(filter, skip, limit) {
  return await memesRepo
    .find(filter, { _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit);
}

module.exports = {
  getAllMemes,
  getMemeById,
  getMemesByTag,
  getMemesByUser,
  getMemesByTemplate,
  getLastMemeId,
  saveMeme,
  updateMeme,
  deleteMeme,
  addCommentToMeme,
  likeMeme,
};
