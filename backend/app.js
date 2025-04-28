const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./utils/passportStrategies');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');

const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoute');
const templateRoutes = require('./routes/templeteRoute');
const resumeRoutes = require('./routes/resumeRoute');


connectToDb();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());




app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/resume', resumeRoutes);



module.exports = app;