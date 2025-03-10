const express = require("express");
const connectDB = require("./config/dbconnection.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan"); // Add Morgan

const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const path = require("path");

require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Use Morgan





// Configurer le dossier des fichiers statiques
app.use(express.static(path.join(__dirname, "public")));


// Configurer le dossier des vues
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);




const PORT = process.env.PORT || 9092;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/ping", (req, res) => {
    res.send("pong");
  });

module.exports = app;