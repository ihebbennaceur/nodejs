const express=require("express");
const connection=require("./config/dbconnection.js");
const mongoose=require('mongoose');

require('dotenv').config();

const app=express();

connect();



PORT=6000;
app.listen(PORT,()=>{ console.log(`Server is running on port ${PORT}`);});



