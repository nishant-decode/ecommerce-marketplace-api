const { Notification } = require("../models/notification.model");
const BasicServices = require("./basic.service");

class NotificationService extends BasicServices {
  constructor() {
    super(Notification);
  }
}

module.exports.NotificationService = new NotificationService();