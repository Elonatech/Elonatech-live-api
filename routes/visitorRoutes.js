/**
 * @swagger
 * tags:
 *   name: Visitors
 *   description: Website visitor analytics
 */

/**
 * @swagger
 * /api/v1/visitors/monthly:
 *   get:
 *     summary: Get monthly visitor counts
 *     tags: [Visitors]
 *     responses:
 *       200:
 *         description: Monthly visitor data
 */
const express = require("express");
const router = express.Router();
const visitorController = require("../controller/visitorController");

router.get("/monthly", visitorController.getMonthlyVisitors);

module.exports = router;

