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
          title: title ? title : oldTicket.title,
          description: description ? description : oldTicket.description,
          status: status ? status : oldTicket.status,
        },
        { new: true }
      );
  
      // 3. Vérification de changement de statut
      if (status && oldTicket.status !== status) {
        // 4. Envoi d'email
        await sendStatusChangeEmail(
          req.user.email, // Email de l'utilisateur connecté (assume que tu as "email" dans ton user)
          updatedTicket.title,
          oldTicket.status,
          updatedTicket.status
        );
      }
  
      // 5. Réponse
      res.json(updatedTicket);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  };

  // Fonction pour envoyer un email + logs
  const sendStatusChangeEmail = async (to, ticketTitle, oldStatus, newStatus) => {
    try {
      // Transporteur email (exemple Outlook)
      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER, // Email via .env
          pass: process.env.EMAIL_PASS, // Password via .env
        },
      });
  
      console.log("Email : " + process.env.EMAIL_USER);
      console.log("Password : " + process.env.EMAIL_PASS);
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to, // Email du destinataire
        subject: "Mise à jour du statut de votre ticket",
        text: `Bonjour,\n\nLe statut de votre ticket "${ticketTitle}" a changé de "${oldStatus}" à "${newStatus}".\n\nCordialement,`,
      };
  
      // Envoi d'email + log succès
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email envoyé avec succès :", info.response);
    } catch (error) {
      // Log en cas d'erreur
      console.error("❌ Erreur lors de l'envoi d'email :", error);
    }
  };
