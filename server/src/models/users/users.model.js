const userRepo = require("./users.mongo");
// const axios = require("axios");

const DEFAULT_USER_ID = 1;

async function getAllUsers(skip, limit) {
  return await userRepo
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
  const lastUser = await userRepo.findOne().sort("-userId");
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
    createdAt: new Date.now(),
    softDeleted: false,
  });
  await userRepo.findOneAndUpdate(
    {
      userId: newUser.userId,
    },
    newUser,
    { upsert: true }
  );
}

async function deleteUser(id) {
  const softDeleted = await userRepo.updateOne(
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
  return await userRepo.findOne(filter);
}

module.exports = {
  getAllUsers,
  getUserById,
  getLastUserId,
  saveUser,
  deleteUser,
};
