const express = require("express");
const router = express.Router();
const visitorController = require("../controller/VisitorController");

router.get("/monthly", visitorController.getMonthlyVisitors);

module.exports = router;
