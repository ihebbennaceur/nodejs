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


  exports.closeTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { status: "closed" },
        { new: true }
      );
  
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.deleteTicket = async (req, res) => {
    try {
      const { id } = req.params;
      await Ticket.findOneAndDelete({ _id: id, user: req.user._id });
      res.json({ message: "Ticket deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.assignTicket = async (req, res) => {
    try {
      const { id } = req.params;
      const { agentId } = req.body;
  
      const userLogged = await User.findById(req.user._id); // Recuperer le user connecté
      const isAdmin = userLogged.role === "admin";
  
      if (!isAdmin) {
        return res
          .status(401)
          .json({ message: "Seuls les admins peuvent attribuer les tickets" });
      }
      const ticket = await Ticket.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { assignedTo: agentId },
        { new: true }
      );
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  