const Notification = require("../model/notificationModel")
const logger = require("../lib/logger")



const createNotification = async (req, res) => {
  try {
    const { type, message, link, relatedId } = req.body
    const notification = new Notification({ type, message, link, relatedId })
    await notification.save()
    res.status(201).json(notification)
  } catch (error) {
    logger.error("Error creating notification:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20)
    res.status(200).json(notifications)
  } catch (error) {
    logger.error("Error fetching notifications:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }
    res.status(200).json(notification)
  } catch (error) {
    logger.error("Error fetching notification:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }
    notification.read = true
    await notification.save()
    res.status(200).json(notification)
  } catch (error) {
    logger.error("Error marking notification as read:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" })
    }
    res.status(204).send()
  } catch (error) {
    logger.error("Error deleting notification:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true })
    res.status(200).json({ message: "All notifications marked as read" })
  } catch (error) {
    logger.error("Error marking all notifications as read:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getUnreadNotificationsCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ read: false })
    res.status(200).json({ count })
  } catch (error) {
    logger.error("Error fetching unread notifications count:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}


module.exports = {
  getAllNotifications,
  createNotification,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
}

