const express = require("express");
const connectDB = require("./config/dbconnection.js");
const mongoose = require('mongoose');
require('dotenv').config();

const app=express();

connectDB();



PORT=6000;
app.listen(PORT,()=>{ console.log(`Server is running on port ${PORT}`);});



