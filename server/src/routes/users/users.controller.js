const {
  getAllUsers,
  getUserById,
  saveUser,
  deleteUser,
} = require("../../models/users/users.model");

const { getPagination } = require("../../services/query");

async function httpGetAllUsers(req, res) {}

async function httpGetUserById(req, res) {}

async function httpSaveUser(req, res) {}

async function httpUpdateUser(req, res) {}

async function httpDeleteUser(req, res) {}

module.exports = {
  httpGetAllUsers,
  httpGetUserById,
  httpSaveUser,
  httpUpdateUser,
  httpDeleteUser,
};
