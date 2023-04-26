const usersRepo = require("./users.mongo");
const memesRepo = require("../memes/memes.mongo");
const {
  saveNotification,
  getFollowNotification,
  removeNotification,
} = require("../notifications/notifications.model");

const DEFAULT_USER_ID = 0;

const FILTRO_DTO = {
  _id: 0,
  __v: 0,
  email: 0,
  googleId: 0,
  isAdmin: 0,
  likedMemes: 0,
  memes: 0,
  searchEntries: 0,
  tags: 0,
  birthday: 0,
  updatedAt: 0,
  about: 0,
};

async function getTotalUsersNumber() {
  try {
    const count = await usersRepo.countDocuments({});
    return count;
  } catch (err) {
    return { error: err.message };
  }
}

async function getAllUsers(skip, limit) {
  return await usersRepo
    .find({ softDeleted: false }, { _id: 0, __v: 0 })
    .sort({ likeCounter: -1 })
    .skip(skip)
    .limit(limit);
}

async function getSoftDeletedUsers(skip, limit) {
  return await usersRepo
    .find({ softDeleted: true }, { _id: 0, __v: 0 })
    .sort({ userId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getUserById(id) {
  return await findUser({
    userId: id,
    softDeleted: false,
  });
}

async function getUserByGoogleId(id) {
  return await findUser({
    googleId: id,
    softDeleted: false,
  });
}

async function getUserByEmail(email) {
  return await findUser({
    email: email,
    softDeleted: false,
  });
}

async function getUserByUsername(username) {
  return await findUser({
    username: username,
    softDeleted: false,
  });
}

async function getUserByNickname(nickname) {
  return await findUser({
    nickname: nickname,
    softDeleted: false,
  });
}

async function getAllFriendsFromUserById(id, skip, limit) {
  const user = await findUser({ userId: id });
  // const followers = await findUsers({ userId: user.followers });
  const followers = await usersRepo
    .find({ userId: user.followers, softDeleted: false }, FILTRO_DTO)
    .skip(skip)
    .limit(limit);
  // const follows = await findUsers({ userId: user.follows });
  const follows = await usersRepo
    .find(
      {
        userId: user.follows,
        softDeleted: false,
      },
      FILTRO_DTO
    )
    .skip(skip)
    .limit(limit);
  const list = {
    followers: followers,
    follows: follows,
  };
  return list;
}

async function getLastUserId() {
  const lastUser = await usersRepo.findOne().sort("-userId");
  if (!lastUser) {
    return DEFAULT_USER_ID;
  }
  return lastUser.userId;
}

async function saveUser(user) {
  const newUserId = (await getLastUserId()) + 1;
  const emailTaken = await findUser({ email: user.email });
  if (emailTaken) {
    throw new Error("Email already taken, pick another one!");
  }
  const newUser = Object.assign(user, {
    userId: newUserId,
    isAdmin: false,
    softDeleted: false,
  });
  return await usersRepo.findOneAndUpdate(
    {
      userId: newUser.userId,
    },
    newUser,
    { upsert: true }
  );
}

async function updateUser(user) {
  const previousUser = await findUser({ userId: user.userId });
  if (!previousUser.isAdmin) user.isAdmin = false;
  if (!previousUser.isMod) user.isMod = false;
  return await usersRepo.findOneAndUpdate({ userId: user.userId }, user, {
    upsert: true,
  });
}

async function makeUserAdmin(userId) {
  const user = await findUser({ userId: userId });
  if (!user) throw new Error("invalid email");
  user.isAdmin = !user.isAdmin;
  user.isMod = !user.isMod;
  user.updatedAt = Date.now();
  return await usersRepo.findOneAndUpdate({ userId: user.userId }, user, {
    upsert: true,
  });
}
async function makeUserMod(userId) {
  const user = await findUser({ userId: userId });
  if (!user) throw new Error("invalid email");
  user.isMod = !user.isMod;
  user.updatedAt = Date.now();
  return await usersRepo.findOneAndUpdate({ userId: user.userId }, user, {
    upsert: true,
  });
}

async function handleFollows(userId, userToFollowId) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User doesn't exists");
  }
  const userToFollow = await getUserById(userToFollowId);
  if (!userToFollow) {
    throw new Error("User to follow doesn't exists");
  }

  //notification preparation
  // const userId = user.userId;
  const fromUserId = user.userId;
  //creo el objeto porque no estoy seguro si la query funciona solo con la Id en un array de objetos
  // la solucion? PASARLE EL OBJETO DIRECTAMENTE AAAAA
  const fromUser = {
    userId: user.userId,
    avatar: user.avatar,
    nickname: user.nickname,
    username: user.username,
  };

  const followedUser = user.follows.includes(userToFollowId);

  if (!followedUser) {
    userToFollow.followers.push(user.userId);
    userToFollow.followersCounter += 1;
    user.follows.push(userToFollow.userId);
    user.followsCounter += 1;
    await updateUser(userToFollow);
    await updateUser(user);

    //noti
    const notiRes = await saveNotification(
      fromUserId,
      userToFollowId,
      "follow",
      null,
      null,
      null
    );
    console.log(notiRes);

    return { res: "followed" };
  } else {
    userToFollow.followers = userToFollow.followers.filter(
      (usr) => usr != user.userId
    );
    if (userToFollow.followersCounter > 0) userToFollow.followersCounter -= 1;
    user.follows = user.follows.filter((usr) => usr != userToFollow.userId);
    if (user.followsCounter > 0) user.followsCounter -= 1;
    await updateUser(userToFollow);
    await updateUser(user);

    const noti = await getFollowNotification(userId, fromUser);
    if (noti) {
      const notiRes = await removeNotification(noti.notificationId);
      console.log(notiRes);
    }

    return { res: "unfollowed" };
  }
}

async function deleteUser(id) {
  const softDeleted = await usersRepo.updateOne(
    {
      userId: id,
    },
    {
      softDeleted: true,
      updatedAt: Date.now(),
    }
  );
  return softDeleted.acknowledged === true && softDeleted.modifiedCount === 1;
}

async function findUser(filter) {
  return await usersRepo.findOne(filter, { _id: 0, __v: 0 });
}

async function findUsers(filter, skip, limit) {
  return await usersRepo
    .find(filter, { _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit);
}

async function banUser(userId) {
  const user = await findUser({ userId: userId });
  if (!user) {
    throw new Error("User not found!");
  }
  if (user.isAdmin && user.isMod) {
    throw new Error("Can't ban admins or moderators");
  }
  user.isBanned = !user.isBanned;
  await usersRepo.findOneAndUpdate({ userId: user.userId }, user, {
    upsert: true,
  });
  if (user.isBanned) {
    return { ok: "user is now banned!" };
  } else return { ok: "user unbanned!" };
}

module.exports = {
  getTotalUsersNumber,
  getAllUsers,
  getSoftDeletedUsers,
  getUserById,
  getUserByEmail,
  getUserByGoogleId,
  getUserByNickname,
  getUserByUsername,
  getAllFriendsFromUserById,
  getLastUserId,
  saveUser,
  deleteUser,
  updateUser,
  makeUserAdmin,
  makeUserMod,
  handleFollows,
  findUsers,
  banUser,
};
