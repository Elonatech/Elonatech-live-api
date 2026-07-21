const Retainer = require("../model/retainerModel")
const logger = require("../lib/logger");

const createRetainer = async (req, res) => {
  const { fullname, company, email, number, service, contract, frequency, days, state, address } = req.body;

  try {
    const newRetainer = await Retainer.create({
      fullname,
      company,
      email,
      number,
      service,
      contract,
      frequency,
      days,
      state,
      address
    });
    await newRetainer.save();
    res.status(201).json({ message: "Retainer created successfully", status: "success", data: newRetainer });
  } catch (error) {
    logger.error("Error creating retainer:", error);
    res.status(500).json({ status: "error", message: "Failed to create retainer" });
  }
};


// Get all retainer requests
const getAllRetainers = async (req, res) => {
  try {
    const retainers = await Retainer.find().sort({ createdAt: -1 });
    res.status(200).json({ retainers });
  } catch (error) {
    logger.error("Error fetching retainers:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch retainers" });
  }
};

const getRetainerById = async (req, res) => {
  try {
    const retainer = await Retainer.findById(req.params.id);
    if (!retainer) {
      return res.status(404).json({ message: "Retainer not found" });
    }
    res.status(200).json({ retainer });
  } catch (error) {
    logger.error("Error fetching retainer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const RETAINER_STATUSES = ["Pending", "Reviewed", "Responded", "Closed"];


const updateRetainerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!RETAINER_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${RETAINER_STATUSES.join(", ")}` });
    }

    const updatedRetainer = await Retainer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedRetainer) {
      return res.status(404).json({ message: "Retainer not found" });
    }
    res.status(200).json({ message: "Retainer status updated", retainer: updatedRetainer });
  } catch (error) {
    logger.error("Error updating retainer status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteRetainer = async (req, res) => {
  try {
    const deletedRetainer = await Retainer.findByIdAndDelete(req.params.id);
    if (!deletedRetainer) {
      return res.status(404).json({ message: "Retainer not found" });
    }
    res.status(200).json({ message: "Retainer deleted successfully", retainer: deletedRetainer });
  } catch (error) {
    logger.error("Error deleting retainer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createRetainer,
  getAllRetainers,
  getRetainerById,
  updateRetainerStatus,
  deleteRetainer
};