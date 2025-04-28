const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGODB_URI}/Mr.KCV`);

    mongoose.connection.on('connected', () => {
        console.log("Database Connected");
    });

    mongoose.connection.on('error', (err) => {
        console.error("Database connection error:", err);
    });
};

module.exports = connectDB;
