const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.URI;

if (!uri) {
    console.error("database URI is incorrect");

}

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
        
        });
        console.log(" connected to db successfully");
    } catch (err) {
        console.error("error connecting to db", err);
       
    }
};

module.exports = connectDB;