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


const PORT = process.env.PORT || 9092;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

