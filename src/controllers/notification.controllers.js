const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { NotificationService } = require("../services/notification.service");

class NotificationController {
  //@desc get all notifications
  //@route GET /api/notification/
  //@access private
  getAllNotifications = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
  
    const notifications = await NotificationService.find({});

    Logger.info(`All notifications: ${notifications}`);
    Response(res)
      .status(200)
      .message("All notifications")
      .body({ notifications })
      .send();
  };

  //@desc get notification
  //@route GET /api/notification/:notificationId
  //@access private
  getNotification = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const notificationId = req.params.notificationId;

    const notification = await NotificationService.findById(notificationId);

    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    Logger.info(`Notification: ${notification}`);
    Response(res)
      .status(200)
      .message("Notification")
      .body({ notification })
      .send();
  };

  //@desc search notifications by search query
  //@route GET /api/notification/search
  //@access private
  searchNotifications = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const searchQuery = req.query.q;

    const foundNotifications = await NotificationService.find({ message: { $regex: searchQuery, $options: "i" } });

    Logger.info(`Notifications found by search query: ${foundNotifications}`);
    Response(res)
      .status(200)
      .message("Notifications found by search query")
      .body({ foundNotifications })
      .send();
  };

  //@desc create notification by sellerId
  //@route POST /api/notification/createNotification
  //@access private
  createNotification = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { category, userId, message, url } = req.body;

    // Validate required fields
    if (!category || !userId || !message || !url) {
      throw new HttpError(400, "Missing required fields");
    }

    // Create notification
    const notification = await NotificationService.create({ category, userId, message, url });

    Logger.info(`Notification created: ${notification}`);
    Response(res)
      .status(201)
      .message("Notification created")
      .body({ notification })
      .send();
  };

  //@desc update notification
  //@route PUT /api/notification/:notificationId
  //@access private
  updateNotification = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const notificationId = req.params.notificationId;
    const { category, userId, message, url } = req.body;

    // Validate required fields
    if (!category || !userId || !message || !url) {
      throw new HttpError(400, "Missing required fields");
    }

    // Check if notification exists
    const notificationExists = await NotificationService.exists({ _id: notificationId });
    if (!notificationExists) {
      throw new HttpError(404, "Notification not found");
    }

    // Update notification
    const updatedNotification = await NotificationService.findByIdAndUpdate(notificationId, {
      category,
      userId,
      message,
      url,
    });

    Logger.info(`Notification updated: ${updatedNotification}`);
    Response(res)
      .status(200)
      .message("Notification updated")
      .body({ updatedNotification })
      .send();
  };

  //@desc delete notification
  //@route DELETE /api/notification/:notificationId
  //@access private
  deleteNotification = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const notificationId = req.params.notificationId;

    // Check if notification exists
    const notificationExists = await NotificationService.exists({ _id: notificationId });
    if (!notificationExists) {
      throw new HttpError(404, "Notification not found");
    }

    // Delete notification
    const deletedNotification = await NotificationService.findByIdAndDelete(notificationId);

    Logger.info(`Notification deleted: ${deletedNotification}`);
    Response(res)
      .status(200)
      .message("Notification deleted")
      .body({ deletedNotification })
      .send();
  };

}

module.exports.NotificationController = new NotificationController();