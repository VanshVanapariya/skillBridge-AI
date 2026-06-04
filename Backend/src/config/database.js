const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("Connected to MongoDB");
    } catch (err) {
        logger.error("Database connection error: %O", err);
        process.exit(1);
    }
}

module.exports = connectToDB;