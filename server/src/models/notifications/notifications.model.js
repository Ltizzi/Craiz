const notiRepo = require("./notifications.mongo");
const userRepo = require("../users/users.mongo");

const DEFAULT_NOTIFICATION_ID = 0;

async function getNotificationsByUserId(id, skip, limit) {
  return await notiRepo
    .find({ ownerId: id }, { _id: 0, __v: 0 })
    .sort({ isNew: 1, updatedAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function getNewNotificationsByUserId(id, skip, limit) {
  return await notiRepo
    .find({ isNew: true, ownerId: id }, { _id: 0, __v: 0 })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
}

async function getLastNotificationId() {
  const lastNot = await notiRepo.findOne().sort("-notificationId");
  if (!lastNot) {
    return DEFAULT_NOTIFICATION_ID;
  }
  return lastNot.notificationId;
}

async function getNotificationByMemeIdTypeAndOwnerId(memeId, ownerId, type) {
  return await notiRepo.findOne(
    { memeId: memeId, ownerId: ownerId, type: type, softDeleted: false },
    { _id: 0, __v: 0 }
  );
}

async function getFollowNotification(ownerId, fromUserId) {
  return await notiRepo.findOne({
    ownerId: ownerId,
    type: "follow",
    fromUser: fromUserId,
  });
}

async function saveNotification(fromUserId, ownerId, type, memeId) {
  const newNotificationId = (await getLastNotificationId()) + 1;
  const fromUser = await userRepo.findOne(
    {
      userId: fromUserId,
      softDeleted: false,
    },
    { _id: 0, __v: 0 }
  );
  if (memeId == _) {
    memeId = null;
  }
  const newNoti = Object.assign(notification, {
    notificationId: newNotificationId,
    type: type,
    isNew: true,
    memeId: memeId,
    ownerId: ownerId,
    fromUser: [
      {
        userId: fromUser.userId,
        avatar: fromUser.avatar,
        nickname: fromUser.nickname,
        username: fromUser.username,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return await notiRepo.findOneAndUpdate(
    {
      notificationId: newNoti.notificationId,
    },
    newNoti,
    { upsert: true }
  );

  async function addFromUserToNotification(notification, fromUserId) {
    const fromUser = await userRepo.findOne(
      {
        userId: fromUserId,
        softDeleted: false,
      },
      { _id: 0, __v: 0 }
    );
    const newFromUser = {
      userId: fromUser.userId,
      avatar: fromUser.avatar,
      nickname: fromUser.nickname,
      username: fromUser.username,
    };
    notification.fromUser.push(newFromUser);
    notification.updatedAt = Date.now();
    notification.isNew = true;
    return await notiRepo.findOneAndUpdate(
      {
        notificationId: notification.notificationId,
      },
      notification,
      { upsert: true }
    );
  }

  async function removeFromUserInNotification(notification, fromUserId) {
    notification.isNew = false;
    notification.fromUser = notification.fromUser.filter(
      (fromUser) => fromUser.userId != fromUserId
    );
    notification.updatedAt = Date.now();
    return await notiRepo.findOneAndUpdate(
      {
        notificationId: notification.notificationId,
      },
      notification,
      { upsert: true }
    );
  }

  async function removeNotification(notificationId) {
    return await notiRepo.remove({ notificationId: notificationId });
  }

  async function checkNotificationAsView(notification) {
    notification.isNew = false;
    notification.updatedAt = Date.now();
    return await notiRepo.findOneAndUpdate(
      {
        notificationId: notification.notificationId,
      },
      notification,
      { upsert: true }
    );
  }

  module.exports = {
    getNewNotificationsByUserId,
    getNotificationsByUserId,
    getNotificationByMemeIdTypeAndOwnerId,
    saveNotification,
    addFromUserToNotification,
    removeFromUserInNotification,
    removeNotification,
    checkNotificationAsView,
    getFollowNotification,
  };
}
