const memesRepo = require("./memes.mongo");

const {
  tagIncrementalCounter,
  tagDecrementalCounter,
} = require("../tags/tags.model");
const { getUserById, updateUser } = require("../users/users.model");
const {
  getNotificationByMemeIdTypeAndOwnerId,
  saveNotification,
  addFromUserToNotification,
  removeFromUserInNotification,
  removeNotification,
} = require("../notifications/notifications.model");
//const axios = require("axios");

const DEFAULT_MEME_ID = 0;

async function getTotalMemesNumber() {
  try {
    const count = await memesRepo.countDocuments({});
    console.log("la cantidad de memes es:", count);
    return count;
  } catch (err) {
    return { error: err.message };
  }
}

async function getTotalFlaggedMemes() {
  try {
    const count = await memesRepo.countDocuments({
      isFlagged: true,
      softDeleted: false,
    });
    return count;
  } catch (err) {
    return { error: err.message };
  }
}

async function getTotalModeratedMemes() {
  try {
    const count = await memesRepo.countDocuments({
      isFlagged: true,
      softDeleted: true,
      isReviewed: true,
    });
    return count;
  } catch (err) {
    return { error: err.message };
  }
}

async function getAllMemes(skip, limit) {
  return await memesRepo
    .find({ softDeleted: false }, { _id: 0, __v: 0 })
    .sort({ memeId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getAllSoftDeletedMemes(skip, limit) {
  return await memesRepo
    .find(
      { softDeleted: true, isReviewed: true, isFlagged: true },
      { _id: 0, __v: 0 }
    )
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function getAllMemesWithoutComments(skip, limit) {
  return await memesRepo
    .find({ softDeleted: false, isComment: false }, { _id: 0, __v: 0 })
    .sort({ updatedAt: -1 })
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
  const meme = await findMeme({ memeId: id, softDeleted: false });
  if (!meme) {
    throw new Error("meme not found!");
  }
  return meme;
}

async function getLastMemeId() {
  const lastMeme = await memesRepo.findOne().sort("-memeId");
  if (!lastMeme) {
    return DEFAULT_MEME_ID;
  }
  return lastMeme.memeId;
}

async function saveMeme(meme) {
  const newMemeId = (await getLastMemeId()) + 1; //busca el último Id y le adiciona 1
  const user = await getUserById(meme.uploader); //busca info del uploader

  //información básica añadida al meme
  const newMeme = Object.assign(meme, {
    memeId: newMemeId,
    likes: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  const tagNames = meme.tags;
  console.log(meme);
  console.log("***");
  console.log(tagNames);
  //incrementa el contador de cada tag -para medir su popularidad-
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
  user.memes.push(newMemeId); //asocia el meme al uploader
  const usedTags = newMeme.tags;
  if (usedTags) {
    for (let i = 0; i < usedTags.length; i++) {
      user.tags.push(usedTags[i]); //agrega los tags al usuario para personalizar contenido luego
    }
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

  //notification
  const userId = meme.uploader;
  const fromUserId = comment.uploader;
  //const user = await getUserById(userId);
  const noti = await getNotificationByMemeIdTypeAndOwnerId(
    meme.memeId,
    userId,
    "comment"
  );

  console.log(noti);
  //existe la notification
  if (noti) {
    await addFromUserToNotification(noti, fromUserId, comment.imgUrl);
  }
  //no existe la notification
  else {
    const notiRes = await saveNotification(
      fromUserId,
      userId,
      "comment",
      memeId,
      meme.imgUrl,
      comment.imgUrl
    );
    console.log(notiRes);
  }

  return uploadedComment;
}

async function updateMeme(meme) {
  meme.updatedAt = Date.now();
  return await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
    upsert: true,
  });
}

async function deleteMeme(memeId, userId) {
  const meme = await findMeme({ memeId: memeId });
  if (!meme) {
    throw new Error("Meme not found!");
  }
  const user = await getUserById(meme.uploader);
  console.log("****");
  console.log("user:", user.userId);
  userId = parseInt(userId);
  console.log("id del user logueado:", userId);
  if (user.userId !== userId) {
    throw new Error("you can't delete other people memes!");
  }
  meme.softDeleted = true;
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
  const memeOwner = await getUserById(meme.uploader);
  if (!memeOwner) {
    throw new Error("Memes should have an owner");
  }
  const likedMeme = user.likedMemes.includes(memeId);

  //preparacion notification
  const noti = await getNotificationByMemeIdTypeAndOwnerId(
    memeId,
    memeOwner.userId,
    "like"
  );
  let fromUserId = userId;
  let ownerId = memeOwner.userId;

  //si el usuario no likeo al meme
  if (!likedMeme) {
    meme.likedBy.push(user.userId);
    meme.likeCounter += 1;
    user.likedMemes.push(meme.memeId);
    memeOwner.likeCounter += 1;
    await updateMeme(meme);
    await updateUser(user);
    if (user.userId != memeOwner.userId) await updateUser(memeOwner);

    //si ya existe la notification
    if (noti) {
      const notiRes = await addFromUserToNotification(noti, fromUserId, null);
      console.log(notiRes);
    }
    //si no existe la crea
    else {
      const notiRes = await saveNotification(
        fromUserId,
        ownerId,
        "like",
        memeId,
        meme.imgUrl,
        null
      );
      console.log(notiRes);
    }

    return { ok: "liked meme" };
  }

  //si el meme ya fue likeado
  else {
    console.log(user.likedMemes);
    meme.likedBy = meme.likedBy.filter((usr) => usr != userId);
    meme.likeCounter -= 1;
    user.likedMemes = user.likedMemes.filter((mm) => mm != memeId);
    memeOwner.likeCounter -= 1;
    await updateMeme(meme);
    await updateUser(user);
    if (user.userId != memeOwner.userId) await updateUser(memeOwner);
    return { ok: "unliked meme" };
    if (noti) {
      const notiRes = await removeFromUserInNotification(noti, fromUserId);
      console.log(notiRes);
    }
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

  //preparacion para notis
  const noti = await getNotificationByMemeIdTypeAndOwnerId(
    memeId,
    userId,
    "loop"
  );
  let fromUserId = userId;
  let ownerId = meme.uploader;

  //para memes  y no loopeados
  if (!alreadyLooped) {
    //add loop counter to original meme
    meme.loopCounter += 1;
    meme.loopersId.push(userId);
    meme.loopersNicknames.push(user.nickname);
    await updateMeme(meme);
    user.memes.push(meme.memeId);
    await updateUser(user);

    //si existe la noti
    if (noti) {
      const notiRes = await addFromUserToNotification(noti, fromUserId, null);
      console.log(notiRes);
    }
    //si no existe
    else {
      const notiRes = await saveNotification(
        fromUserId,
        ownerId,
        "loop",
        memeId,
        meme.imgUrl,
        null
      );
      console.log(notiRes);
    }

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

    if (noti) {
      const notiRes = await removeFromUserInNotification(noti, fromUserId);
      console.log(notiRes);
    }

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

//moderation

async function flagMeme(memeId) {
  const meme = await findMeme({ memeId: memeId });
  if (!meme) {
    throw new Error("Meme not found!");
  }
  if (meme.isFlagged) {
    meme.flagCounter++;
    await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
      upsert: true,
    });
    return { ok: "meme flagged" };
  } else {
    meme.isFlagged = true;
    meme.flagCounter++;
    await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
      upsert: true,
    });
    return { ok: "meme flagged" };
  }
}

async function getAllFlaggedMemes(skip, limit) {
  return await findMemes({ isFlagged: true, softDeleted: false }, skip, limit);
}

async function modDeleteMeme(memeId) {
  const meme = await findMeme({ memeId: memeId });
  if (!meme) {
    throw new Error("Meme not found!");
  }
  meme.softDeleted = !meme.softDeleted;

  await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
    upsert: true,
  });
  if (meme.softDeleted && meme.isFlagged) {
    return { ok: "meme soft deleted!" };
  } else if (!meme.softDeleted && meme.isFlagged) {
    return { ok: "meme was recovered!" };
  } else {
    return { error: "Can't deleted unflagged memes!" };
  }
}

async function modReviewMeme(memeId) {
  const meme = await findMeme({ memeId: memeId });
  if (!meme) throw new Error("Meme not found");
  meme.isReviewed = !meme.isReviewed;
  await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
    upsert: true,
  });
  if (meme.isReviewed) return { ok: "Meme has been reviewed" };
  if (!meme.isReviewed) return { ok: "Meme status changed to unreviewed" };
}

async function adminDeleteMeme(memeId) {
  const meme = await findMeme({ memeId: memeId });
  if (!meme) {
    throw new Error("Meme not found!");
  }
  meme.softDeleted = !meme.softDeleted;
  await memesRepo.findOneAndUpdate({ memeId: meme.memeId }, meme, {
    upsert: true,
  });
  if (meme.softDeleted) {
    return { ok: "meme soft deleted!" };
  } else return { ok: "meme was recovered!" };
}

module.exports = {
  getTotalMemesNumber,
  getTotalFlaggedMemes,
  getTotalModeratedMemes,
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
  flagMeme,
  getAllFlaggedMemes,
  modDeleteMeme,
  modReviewMeme,
  adminDeleteMeme,
};
