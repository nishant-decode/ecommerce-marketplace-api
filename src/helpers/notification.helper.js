const { NotificationService } = require("../services/notification.service");

const sendNotification = async (userId, category, message) => {
  const notification = await NotificationService.create({
    category,
    userId,
    message,
  });
  return notification;
};

module.exports = { sendNotification };
