const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");
const { verifyToken } = require("../middleware/Admin");

router.get("/all", verifyToken, notificationController.getAllNotifications);
router.get("/unread-count", verifyToken, notificationController.getUnreadNotificationsCount);
router.get("/:id", verifyToken, notificationController.getNotificationById);
router.patch("/read-all", verifyToken, notificationController.markAllNotificationsAsRead);
router.patch("/:id/read", verifyToken, notificationController.markNotificationAsRead);
router.delete("/:id", verifyToken, notificationController.deleteNotification);

module.exports = router;
