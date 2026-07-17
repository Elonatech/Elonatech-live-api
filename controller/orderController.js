const Order = require("../model/orderModel");
const logger = require("../lib/logger");

const ORDER_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"];

// GET /api/v1/orders/all — admin list, newest first
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    logger.error("Get all orders error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/v1/orders/:id — single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ success: true, order });
  } catch (error) {
    logger.error("Get order by id error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /api/v1/orders/:id — update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${ORDER_STATUSES.join(", ")}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    logger.error("Update order status error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /api/v1/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    logger.error("Delete order error", { error });
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
