const usersRepo = require("./users.mongo");
const memesRepo = require("../memes/memes.mongo");
// const axios = require("axios");

const DEFAULT_USER_ID = 0;

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
  // const followedUser = user.follows.filter(
  //   (followedUsr) => followedUsr == userToFollowId
  // );
  const followedUser = user.follows.includes(userToFollowId);
  // if (followedUser.length == 0) {
  if (!followedUser) {
    userToFollow.followers.push(user.userId);
    userToFollow.followersCounter += 1;
    user.follows.push(userToFollow.userId);
    user.followsCounter += 1;
    await updateUser(userToFollow);
    await updateUser(user);
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

module.exports = {
  getAllUsers,
  getSoftDeletedUsers,
  getUserById,
  getUserByEmail,
  getUserByGoogleId,
  getUserByNickname,
  getUserByUsername,
  getLastUserId,
  saveUser,
  deleteUser,
  updateUser,
  handleFollows,
};
