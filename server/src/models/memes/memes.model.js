const memesRepo = require("./memes.mongo");

const {
  tagIncrementalCounter,
  tagDecrementalCounter,
} = require("../tags/tags.model");
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

async function getAllSoftDeletedMemes(skip, limit) {
  return await memesRepo
    .find({ softDeleted: true }, { _id: 0, __v: 0 })
    .sort({ memeId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getAllMemesWithoutComments(skip, limit) {
  return await memesRepo
    .find({ softDeleted: false, isComment: false }, { _id: 0, __v: 0 })
    .sort({ memeId: -1 })
    .skip(skip)
    .limit(limit);
}

async function getUserMemesWithoutComments(userId, skip, limit) {
  return await memesRepo
    .find(
      {
        uploader: userId,
        softDeleted: false,
        isComment: false,
      },
      { _id: 0, __v: 0 }
    )
    .sort({ memeId: -1 })
    .skip(skip)
    .limit(limit);
}

async function getUserComments(userId, skip, limit) {
  return await memesRepo
    .find(
      { uploader: userId, softDeleted: false, isComment: true },
      { _id: 0, __v: 0 }
    )
    .sort({ memeId: -1 })
    .skip(skip)
    .limit(limit);
}

async function getUserLoopedMemes(userId, skip, limit) {
  return await memesRepo
    .find({ loopersId: userId, softDeleted: false }, { _id: 0, __v: 0 })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function getUserLikedMemes(userId, skip, limit) {
  return await memesRepo
    .find({ likedBy: userId, softDeleted: false }, { _id: 0, __v: 0 })
    .sort({ memeId: -1 })
    .skip(skip)
    .limit(limit);
}

async function getAllCommentsFromAMemeById(meme_id, skip, limit) {
  const meme = await getMemeById(meme_id);
  let comments = await memesRepo
    .find(
      {
        memeId: { $in: meme.comments },
        softDeleted: false,
      },
      { _id: 0, __v: 0 }
    )
    .sort({ memeId: -1 })
    .skip(skip)
    .limit(limit);
  return comments;
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
  const tagNames = meme.tags;
  console.log(meme);
  console.log("***");
  console.log(tagNames);
  tagNames.forEach((tag) => {
    tagIncrementalCounter(tag);
  });

  const savedMeme = await memesRepo.findOneAndUpdate(
    { memeId: newMeme.memeId },
    newMeme,
    {
      upsert: true,
    }
  );
  user.memes.push(newMemeId);
  const usedTags = newMeme.tags;
  if (usedTags) {
    for (let i = 0; i < usedTags.length; i++) {
      user.tags.push(usedTags[i]);
    }
    usedTags.forEach((tag) => {
      tagIncrementalCounter(tag);
    });
  }
  await updateUser(user);
  return savedMeme;
}

async function addCommentToMeme(memeId, comment) {
  const meme = await findMeme({ memeId: memeId });
  if (!meme) {
    throw new Error("Parent meme not found!");
  }
  comment.isComment = true;
  comment.parentMeme = memeId;
  const uploadedComment = await saveMeme(comment);
  meme.comments.push(comment.memeId);
  meme.commentsCounter += 1;
  await updateMeme(meme);
  return uploadedComment;
}

async function updateMeme(meme) {
  // const tagNames = meme.tags;
  // tagNames.forEach((tag) => {
  //   tagIncrementalCounter(tag);
  // });
  meme.updatedAt = Date.now();
  return await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
    upsert: true,
  });
}

async function deleteMeme(memeId, userId) {
  const meme = await findMeme({ memeId: memeId });
  const user = await getUserById(meme.uploader);
  console.log("****");
  console.log("user:", user.userId);
  userId = parseInt(userId);
  console.log("id del user logueado:", userId);
  if (user.userId !== userId) {
    throw new Error("you can't delete other people memes!");
  }
  meme.softDeleted = true;
  // meme.updatedAt = Date.now();
  user.memes = user.memes.filter((mm) => mm != memeId);
  if (meme.isComment) {
    const parentMeme = await findMeme({ memeId: meme.parentMeme });
    parentMeme.commentsCounter -= 1;
    await updateMeme(parentMeme);
  }
  const softDeleted = await updateMeme(meme);
  await updateUser(user);
  return { ok: "meme deleted", meme: softDeleted };
}

async function likeMeme(memeId, userId) {
  const meme = await getMemeById(memeId);
  if (!meme) {
    throw new Error("Meme doesn't exists");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User doesn't exists");
  }
  const likedMeme = user.likedMemes.filter((mem) => mem == memeId);
  console.log(likedMeme);
  if (likedMeme.length == 0) {
    meme.likedBy.push(user.userId);
    user.likedMemes.push(meme.memeId);
    user.likeCounter += 1;
    await updateMeme(meme);
    await updateUser(user);
    return { ok: "liked meme" };
  } else {
    meme.likedBy = meme.likedBy.filter((usr) => usr != userId);
    user.likedMemes = user.likedMemes.filter((mm) => mm != memeId);
    user.likeCounter -= 1;
    await updateMeme(meme);
    await updateUser(user);
    return { ok: "unliked meme" };
  }
}

async function loopMeme(memeId, userId) {
  const meme = await getMemeById(memeId);
  if (!meme) {
    throw new Error("Meme doesn't exists");
  }
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User doesn't exists");
  }
  const alreadyLooped = user.memes.includes(memeId);

  //para memes  y no loopeados
  if (!alreadyLooped) {
    //add loop counter to original meme
    meme.loopCounter += 1;
    meme.loopersId.push(userId);
    meme.loopersNicknames.push(user.nickname);
    await updateMeme(meme);
    user.memes.push(meme.memeId);
    await updateUser(user);
    return { ok: "looped Meme" };
  } else {
    meme.loopCounter -= 1;
    meme.loopersId = meme.loopersId.filter((looperId) => looperId != userId);
    meme.loopersNicknames = meme.loopersNicknames.filter(
      (looperNick) => looperNick != user.nickname
    );
    await updateMeme(meme);
    user.memes = user.memes.filter((meme) => meme != memeId);
    await updateUser(user);
    return { ok: "unlooped Meme" };
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
  getAllSoftDeletedMemes,
  getAllMemesWithoutComments,
  getAllCommentsFromAMemeById,
  getMemeById,
  getMemesByTag,
  getMemesByUser,
  getUserMemesWithoutComments,
  getUserComments,
  getUserLoopedMemes,
  getUserLikedMemes,
  getMemesByTemplate,
  getLastMemeId,
  saveMeme,
  updateMeme,
  deleteMeme,
  addCommentToMeme,
  likeMeme,
  loopMeme,
};
