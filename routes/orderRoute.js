const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const { verifyToken } = require("../middleware/Admin");

router.get("/all", verifyToken, orderController.getAllOrders);
router.get("/:id", verifyToken, orderController.getOrderById);
router.patch("/:id", verifyToken, orderController.updateOrderStatus);
router.delete("/:id", verifyToken, orderController.deleteOrder);

module.exports = router;
