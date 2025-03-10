const Ticket = require("../models/Ticket");
const nodemailer = require("nodemailer"); 
const User = require("../models/user");


exports.createTicket = async (req, res) => {
    try {
      const { title, description } = req.body;
      const ticket = await Ticket.create({
        title,
        description,
        user: req.user._id,
      });
      res.status(201).json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };