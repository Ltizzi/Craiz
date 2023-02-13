const {
  getAllUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
} = require("../../models/users/users.model");

const { getPagination } = require("../../services/query");

const {
  notNullUserValidator,
  userHasBirthdayAndValidateIt,
} = require("../../services/validators");

async function httpGetAllUsers(req, res) {
  console.log(req.query);
  const { skip, limit } = getPagination(req.query);
  const users = await getAllUsers(skip, limit);
  return res.status(200).json(users);
}

async function httpGetUserById(req, res) {
  console.log(req.query);
  const userId = req.query.id;
  const user = await getUserById(userId);
  return res.status(200).json(user);
}

async function httpSaveUser(req, res) {
  let newUser = req.body;
  // if (!newUser.username || !newUser.nickname || !newUser.email) {
  //   return res.status(400).json({
  //     error: "user data cannot be null",
  //   });
  // }
  notNullUserValidator(newUser);

  // if (newUser.birthday) {
  //   newUser.birthday = birthdayValidator(newUser.birthday);
  // }-
  newUser = userHasBirthdayAndValidateIt(newUser);

  newUser.createdAt = Date.now();
  await saveUser(newUser);
  return res.status(201).json(newUser);
}

async function httpUpdateUser(req, res) {
  const user = req.body;
  notNullUserValidator(user);
  user = userHasBirthdayAndValidateIt(user);
  user.updatedAt = Date.now();
  await updateUser(user);
  return res.status(200).json(user);
}

async function httpDeleteUser(req, res) {
  const userId = req.query.id;
  const existUser = await getUserById(userId);
  if (!existUser) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  const deleted = await deleteUser(userId);
  if (!deleted) {
    return res.status(400).json({
      error: "Can't delete user",
    });
  }
  if (deleted) {
    return res.status(200).json({
      ok: "User deleted",
    });
  }
}

module.exports = {
  httpGetAllUsers,
  httpGetUserById,
  httpSaveUser,
  httpUpdateUser,
  httpDeleteUser,
};
