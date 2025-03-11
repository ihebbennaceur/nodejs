const nodemailer = require("nodemailer");
require("dotenv").config();

const sendTestEmail = async () => {
  try {
    console.log("📧 Tentative d'envoi d'un email...");

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "send64base@outlook.fr",
      subject: "Test de Nodemailer",
      text: "Ceci est un email de test envoyé via Nodemailer.",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email envoyé avec succès :", info.response);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
  }
};

require("dotenv").config();



sendTestEmail();



console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "MISSING");
