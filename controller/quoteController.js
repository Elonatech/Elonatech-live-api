const   Quote = require("../model/quoteModel");
const logger = require("../lib/logger");

const createQuote = async (req, res) => {
  try {
    const { fullname, email, number, description, company, project, location } = req.body;
    const newQuote = new Quote({
      fullname,
      email,
      number,
      description,
      company,
      project,
      location
    });
    await newQuote.save();
    res.status(201).json({ message: "Quote created successfully", quote: newQuote });
  } catch (error) {
    logger.error("Error creating quote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ quotes });
  } catch (error) {
    logger.error("Error fetching quotes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    res.status(200).json({ quote });
  } catch (error) {
    logger.error("Error fetching quote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const QUOTE_STATUSES = ["Pending", "Reviewed", "Responded", "Closed"];

// Admins don't edit a customer's quote content — they only move it through a
// status workflow, so this updates status only.
const updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!QUOTE_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${QUOTE_STATUSES.join(", ")}` });
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    res.status(200).json({ message: "Quote status updated", quote: updatedQuote });
  } catch (error) {
    logger.error("Error updating quote status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteQuote = async (req, res) => {
  try {
    const deletedQuote = await Quote.findByIdAndDelete(req.params.id);
    if (!deletedQuote) {
      return res.status(404).json({ message: "Quote not found" });
    }
    res.status(200).json({ message: "Quote deleted successfully", quote: deletedQuote });
  } catch (error) {
    logger.error("Error deleting quote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  deleteQuote
};