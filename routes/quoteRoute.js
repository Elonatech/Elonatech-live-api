const express = require("express");
const router = express.Router();
const quoteController = require("../controller/quoteController");
const { verifyToken } = require("../middleware/Admin");

router.post("/", verifyToken, quoteController.createQuote);
router.get("/all", verifyToken, quoteController.getAllQuotes);
router.get("/:id", verifyToken, quoteController.getQuoteById);
router.patch("/:id", verifyToken, quoteController.updateQuoteStatus);
router.delete("/:id", verifyToken, quoteController.deleteQuote);

module.exports = router;
