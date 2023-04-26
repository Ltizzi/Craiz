const {
  getTotalUsersNumber,
  getAllUsers,
  getSoftDeletedUsers,
  getUserById,
  getUserByNickname,
  getUserByUsername,
  getAllFriendsFromUserById,
  saveUser,
  updateUser,
  makeUserAdmin,
  makeUserMod,
  deleteUser,
  handleFollows,
  banUser,
} = require("../../models/users/users.model");

const { getPagination } = require("../../services/query");

const {
  notNullUserValidator,
  userHasBirthdayAndValidateIt,
} = require("../../services/validators");

async function httpGetTotalUsersNumber(req, res) {
  try {
    const count = await getTotalUsersNumber();
    return res.status(200).json(count);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

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

async function httpGetUserByUsername(req, res) {
  try {
    const username = req.query.username;
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ error: "User not found!" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetUserByNickname(req, res) {
  try {
    const nickname = req.query.nickname;
    const user = await getUserByNickname(nickname);
    if (!user) return res.status(404).json({ error: "User not found!" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpGetAllFriendsByUserId(req, res) {
  try {
    const id = req.query.id;
    const { skip, limit } = getPagination(req.query);
    const friends = await getAllFriendsFromUserById(id, skip, limit);
    return res.status(200).json(friends);
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
    console.log("asdasd");
    await updateUser(user);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

async function httpMakeUserAdmin(req, res) {
  try {
    let userId = req.query.id;
    await makeUserAdmin(userId);
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    return res.status(400).son({ error: err.message });
  }
}

async function httpMakeUserMod(req, res) {
  try {
    let userId = req.query.id;
    await makeUserMod(userId);
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
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

async function httpHandleFollows(req, res) {
  const userId = req.query.userId;
  const userToFollowId = req.query.userToFollowId;
  try {
    const followHandled = await handleFollows(userId, userToFollowId);
    return res.status(200).json(followHandled);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function httpBanUser(req, res) {
  try {
    const userId = req.query.userId;
    const response = await banUser(userId);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
}

module.exports = {
  httpGetTotalUsersNumber,
  httpGetAllUsers,
  httpGetSoftDeletedUsers,
  httpGetUserById,
  httpGetUserByUsername,
  httpGetUserByNickname,
  httpGetAllFriendsByUserId,
  httpSaveUser,
  httpUpdateUser,
  httpMakeUserAdmin,
  httpMakeUserMod,
  httpDeleteUser,
  httpHandleFollows,
  httpBanUser,
};
