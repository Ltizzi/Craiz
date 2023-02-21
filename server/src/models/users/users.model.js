const usersRepo = require("./users.mongo");
const memesRepo = require("../memes/memes.mongo");
// const axios = require("axios");

const DEFAULT_USER_ID = 0;

async function getAllUsers(skip, limit) {
  return await usersRepo
    .find({ softDeleted: false }, { _id: 0, __v: 0 })
    .sort({ userId: 1 })
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

async function addFriendToUser(user, friend) {
  // const user = await findUser({ userId: userId });
  // const friend = await findUser({ userId: friendId });

  let alreadyFriend = user.friends.filter((fr) => fr == friend.userId);
  console.log(alreadyFriend);
  if (alreadyFriend.length > 0) {
    throw new Error("Friend already added");
  }
  console.log("friend user: " + friend.userId);
  user.friends.push(friend.userId);
  return await updateUser(user);
}

async function removeFriendFromUser(user, friend) {
  let userFriends = user.friends;
  const foundFriend = userFriends.filter((fr) => {
    fr == friend.friendId;
  });
  if (foundFriend) {
    user.friends = userFriends.filter((fr) => fr != friend.userId);
    return await updateUser(user);
  } else return res.json({ error: "friend not found" });
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

function isFriend(friends, friendId) {
  const foundFriend = friends.filter((friend) => {
    friend == friendId;
  });
  if (foundFriend) return true;
  else return false;
}

module.exports = {
  getAllUsers,
  getSoftDeletedUsers,
  getUserById,
  getLastUserId,
  saveUser,
  deleteUser,
  updateUser,
  addFriendToUser,
  removeFriendFromUser,
};
