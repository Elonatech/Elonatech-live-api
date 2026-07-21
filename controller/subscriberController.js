const Subscriber = require("../model/subscriberModel");
const logger = require("../lib/logger");

const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ subscribers });
  } catch (error) {
    logger.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const deletedSubscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!deletedSubscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.status(200).json({ message: "Subscriber deleted successfully", subscriber: deletedSubscriber });
  } catch (error) {
    logger.error("Error deleting subscriber:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllSubscribers,
  deleteSubscriber
};