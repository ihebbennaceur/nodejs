const Ticket = require("../models/ticket");

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
  
  exports.getTickets = async (req, res) => {
    try {
      const tickets = await Ticket.find({ user: req.user._id }).populate(
        "user",
        "name email"
      );
      res.json(tickets);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  

  const nodemailer = require("nodemailer");
require("dotenv").config();


exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // 1. Récupérer l'ancien ticket
    const oldTicket = await Ticket.findOne({ _id: id, user: req.user._id });
    if (!oldTicket) {
      return res.status(404).json({ message: "Ticket non trouvé." });
    }

    // 2. Mise à jour du ticket
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        title: title || oldTicket.title,
        description: description || oldTicket.description,
        status: status || oldTicket.status,
      },
      { returnDocument: "after" }
    );

    // 3. Vérification du changement de statut
    if (status && oldTicket.status !== status) {
      console.log("🔄 Changement de statut détecté :", oldTicket.status, "→", status);

      // 4. Envoi d'email avec gestion d'erreur
      try {
        await sendStatusChangeEmail(req.user.email, updatedTicket.title, oldTicket.status, updatedTicket.status);
        console.log("📩 Email envoyé avec succès !");
      } catch (emailError) {
        console.error("❌ Échec de l'envoi de l'email :", emailError);
      }
    }

    // 5. Réponse finale
    res.json(updatedTicket);
  } catch (error) {
    console.error("❌ Erreur dans updateTicket :", error);
    res.status(500).json({ message: "Une erreur est survenue." });
  }
};

// Fonction pour envoyer un email
const sendStatusChangeEmail = async (to, ticketTitle, oldStatus, newStatus) => {
  try {
    console.log("📧 Préparation de l'envoi d'email...");

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("✅ Connexion SMTP établie avec", process.env.EMAIL_USER);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Mise à jour du statut de votre ticket",
      text: `Bonjour,\n\nLe statut de votre ticket "${ticketTitle}" a changé de "${oldStatus}" à "${newStatus}".\n\nCordialement,`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Email envoyé :", info.response);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi d'email :", error);
    throw error; // Rejeter l'erreur pour être gérée dans updateTicket
  }
};
