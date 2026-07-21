const Consultation = require("../model/consultationModel");
const logger = require("../lib/logger");

const createConsultation = async (req, res) => {
  try {
    const { name, email, occupation, challenge, business, cost, invest } = req.body;
    const newConsultation = new Consultation({
      name,
      email,
      occupation,
      challenge,
      business,
      cost,
      invest
    });
    await newConsultation.save();
    res.status(201).json({ message: "Consultation created successfully", consultation: newConsultation });
  } catch (error) {
    logger.error("Error creating consultation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.status(200).json({ consultations });
  } catch (error) {
    logger.error("Error fetching consultations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    res.status(200).json({ consultation });
  } catch (error) {
    logger.error("Error fetching consultation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CONSULTATION_STATUSES = ["Pending", "Reviewed", "Responded", "Closed"];

const updateConsultationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!CONSULTATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${CONSULTATION_STATUSES.join(", ")}` });
    }

    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedConsultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    res.status(200).json({ message: "Consultation status updated", consultation: updatedConsultation });
  } catch (error) {
    logger.error("Error updating consultation status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteConsultation = async (req, res) => {
  try {
    const deletedConsultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!deletedConsultation) {
      return res.status(404).json({ message: "Consultation not found" });
    }
    res.status(200).json({ message: "Consultation deleted successfully", consultation: deletedConsultation });
  } catch (error) {
    logger.error("Error deleting consultation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  updateConsultationStatus,
  deleteConsultation
};
