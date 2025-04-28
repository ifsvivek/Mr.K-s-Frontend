const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("Database Connected"))

    await mongoose.connect(`${process.env.DB_CONNECT}/MrKCV`)

};

module.exports = connectDB;

