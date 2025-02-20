const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.URI;

if (!uri) {
    console.error("database URI is incorrect");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" connected to db successfully");
    } catch (err) {
        console.error("error connecting to db", err);
        process.exit(1);
    }
};

module.exports = connectDB;