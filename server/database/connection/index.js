const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

const connectToMongoDB = async() => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to database');
    } catch (err) {
        console.error('Error connecting to database', err);
    }
}

module.exports = connectToMongoDB;