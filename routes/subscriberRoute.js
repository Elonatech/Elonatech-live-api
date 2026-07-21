const express = require("express");
const router = express.Router();
const subscriberController = require("../controller/subscriberController");
const { verifyToken } = require("../middleware/Admin");

router.get("/all", verifyToken, subscriberController.getAllSubscribers);
router.delete("/:id", verifyToken, subscriberController.deleteSubscriber);

module.exports = router;
