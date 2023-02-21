const usersRepo = require("./users.mongo");
const memesRepo = require("../memes/memes.mongo");
// const axios = require("axios");

const DEFAULT_USER_ID = 1;

async function getAllUsers(skip, limit) {
  return await usersRepo
    .find({}, { _id: 0, __v: 0 })
    .sort({ userId: 1 })
    .skip(skip)
    .limit(limit);
}

async function getUserById(id) {
  return await findUser({
    userId: id,
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

async function addFriendToUser(user, friend) {
  // const user = await findUser({ userId: userId });
  // const friend = await findUser({ userId: friendId });
  user.friends.push(friend.userId);
  return await updateUser(user);
}

async function removeFriendFromUser(user, friend) {
  let userFriends = user.friends;
  let isFriend = isFriend(userFriends, friend.userId);
  if (isFriend) {
    user.friends = userFriends.filter(friend != friend.userId);
  }
  return await updateUser(user);
}

async function deleteUser(id) {
  const softDeleted = await usersRepo.updateOne(
    {
      userId: id,
    },
    {
      softDeleted: true,
      updatedAt: new Date.now(),
    }
  );
  return softDeleted.acknowledged === true && softDeleted.modifiedCount === 1;
}

async function findUser(filter) {
  return await usersRepo.findOne(filter);
}

function isFriend(friends, friendId) {
  const foundFriend = friends.filter((friend) => {
    friend == friendId;
  });
  if (foundFriend) return true;
  else return false;
}

module.exports = {
  getAllUsers,
  getUserById,
  getLastUserId,
  saveUser,
  deleteUser,
  updateUser,
  addFriendToUser,
  removeFriendFromUser,
};
