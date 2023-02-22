const {
  getAllUsers,
  getSoftDeletedUsers,
  getUserById,
  saveUser,
  updateUser,
  deleteUser,
  addFriendToUser,
  removeFriendFromUser,
} = require("../../models/users/users.model");

const { getPagination } = require("../../services/query");

const {
  notNullUserValidator,
  userHasBirthdayAndValidateIt,
} = require("../../services/validators");

async function httpGetAllUsers(req, res) {
  try {
    console.log(req.query);
    const { skip, limit } = getPagination(req.query);
    const users = await getAllUsers(skip, limit);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetSoftDeletedUsers(req, res) {
  try {
    const { skip, limit } = getPagination(req.query);
    const softDeletedUsers = await getSoftDeletedUsers(skip, limit);
    return res.status(200).json(softDeletedUsers);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetUserById(req, res) {
  try {
    const userId = req.query.id;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found!" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpSaveUser(req, res) {
  var newUser = req.body;

  notNullUserValidator(newUser);
  newUser = userHasBirthdayAndValidateIt(newUser);

  newUser.createdAt = Date.now();
  try {
    await saveUser(newUser);
    return res.status(201).json(newUser);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function httpUpdateUser(req, res) {
  try {
    var user = req.body;
    notNullUserValidator(user);
    user = userHasBirthdayAndValidateIt(user);
    user.updatedAt = Date.now();
    await updateUser(user);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
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

async function httpAddFriendToUser(req, res) {
  const userId = req.query.id;
  const friendId = req.query.friendId;
  try {
    const user = await getUserById(userId);
    const friend = await getUserById(friendId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    if (!friend) {
      return res.status(404).json({ error: "Invalid user Id" });
    }
    await addFriendToUser(user, friend);
    return res.status(200).json({
      user: userId,
      friend: friendId,
      message: "Friend added to user",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function httpRemoveFriendFromUser(req, res) {
  const userId = req.query.id;
  const friendId = req.query.friendId;
  try {
    const user = await getUserById(userId);
    const friend = await getUserById(friendId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    if (!friend) {
      return res.status(404).json({ error: "Invalid user Id" });
    }
    await removeFriendFromUser(user, friend);
    return res.status(200).json({
      user: userId,
      friend: friendId,
      message: "Friend removed from user",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  httpGetAllUsers,
  httpGetSoftDeletedUsers,
  httpGetUserById,
  httpSaveUser,
  httpUpdateUser,
  httpDeleteUser,
  httpAddFriendToUser,
  httpRemoveFriendFromUser,
};
