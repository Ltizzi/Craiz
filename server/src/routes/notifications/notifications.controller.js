const {
  checkNotificationAsView,
  getNotificationsByUserId,
  getNewNotificationsByUserId,
} = require("../../models/notifications/notifications.model");

const { getPagination } = require("../../services/query");

async function httpGetNotificationsByUserId(req, res) {
  try {
    const userId = req.query.id;
    const { skip, limit } = getPagination(req.query);
    const notifications = await getNotificationsByUserId(userId, skip, limit);
    return res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function httpGetNewNotificationsByUserId(req, res) {
  try {
    const userId = req.query.id;
    const { skip, limit } = getPagination(req.query);
    const notifications = await getNewNotificationsByUserId(
      userId,
      skip,
      limit
    );
    return res.status(200).json(notifications);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

async function httpCheckNotificationAsView(req, res) {
  try {
    const notification = req.body;
    const response = await checkNotificationAsView(notification);
    return res.status(200).json({ ok: response });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  httpCheckNotificationAsView,
  httpGetNewNotificationsByUserId,
  httpGetNotificationsByUserId,
};
