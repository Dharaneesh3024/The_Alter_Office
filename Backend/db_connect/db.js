const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
    const uri = config.mongoUri;

    if (!uri) {
        console.warn('MONGO_URI not set. Please set it in .env to connect to MongoDB Atlas.');
        return;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
