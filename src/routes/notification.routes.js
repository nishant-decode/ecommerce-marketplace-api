const express = require("express");
const { Auth } = require("../middlewares/auth.middlewares");
const access = require('../middlewares/access.middlewares');
const { NotificationController } = require("../controllers/notification.controllers");

const router = express.Router();

//get requests
router.get("/", [Auth, access('Buyer','Admin')], NotificationController.getAllNotifications);
router.get("/:notificationId", [Auth, access('Admin')], NotificationController.getNotification);
router.get("/search", [Auth, access('Buyer','Admin')], NotificationController.searchNotifications);

//post requests
router.post("createNotification", [Auth, access('Admin')], NotificationController.createNotification);

//put requests
router.put("/:notificationId", [Auth, access('Admin')], NotificationController.updateNotification);

//delete requests
router.delete("/:notificationId", [Auth, access('Admin')], NotificationController.deleteNotification);

module.exports.PostRouter = router;