const express = require("express");
const router = express.Router();
const visitorController = require("../controller/visitorController");

router.get("/monthly", visitorController.getMonthlyVisitors);

module.exports = router;
