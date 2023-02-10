const userRepo = require("./users.mongo");

const axios = require("axios");

async function getAllUsers(skip, limit) {}

async function getUserById(id) {}

async function getLastUserId() {}

async function saveUser(user) {}

async function deleteUser(id) {}

module.exports = {
  getAllUsers,
  getUserById,
  getLastUserId,
  saveUser,
  deleteUser,
};
