const Contact = require("../model/contactModel");
const Retainer = require("../model/retainerModel");
const Quote = require("../model/quoteModel");
const Consultation = require("../model/consultationModel");
const { sendEmail } = require("../utils/email");
const logger = require("../lib/logger");


const createContact = async (req, res) => {
  const { name, email, subject, number, message } = req.body;

  try {
    const newContact = await Contact.create({
      name,
      email,
      subject,
      number,
      message
    });
    await newContact.save();
    res.status(201).json({ message: "Contact created successfully", status: "success", data: newContact });
  } catch (error) {
    logger.error("Error creating contact:", error);
    res.status(500).json({ status: "error", message: "Failed to create contact" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
  } catch (error) {
    logger.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ contact });
  } catch (error) {
    logger.error("Error fetching contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const CONTACT_STATUSES = ["New", "Read", "Replied", "Closed"];

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!CONTACT_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${CONTACT_STATUSES.join(", ")}` });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact status updated", contact: updatedContact });
  } catch (error) {
    logger.error("Error updating contact status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully", contact: deletedContact });
  } catch (error) {
    logger.error("Error deleting contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
};
