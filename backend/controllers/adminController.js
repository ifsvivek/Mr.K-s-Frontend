const adminModel = require('../models/adminModel.js');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListTokenModel.js');

module.exports.registerAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const isAdminAlready = await adminModel.findOne({ email });

    if (isAdminAlready) {
        return res.status(400).json({ message: 'Admin already exists' });
    }

    try {

        const hashedPassword = await adminModel.hashPassword(password);

        const admin = new adminModel({
            name,
            email,
            password: hashedPassword,
        });

        await admin.save();

        const token = admin.generateAuthToken();

        res.status(201).json({ token, admin });
    } catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.loginAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email }).select('+password');

    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = admin.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, admin });
}

module.exports.getAdminProfile = async (req, res, next) => {

    res.status(200).json(req.admin);

}

module.exports.updateAdminPassword = async (req, res, next) => {
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { oldPassword, newPassword } = req.body;
    
        const isMatch = await req.admin.comparePassword(oldPassword);
    
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }
    
        const hashedPassword = await adminModel.hashPassword(newPassword);
    
        await adminModel.findByIdAndUpdate(req.admin._id, { password: hashedPassword });
    
        res.status(200).json({ message: 'Password updated successfully' });
    
    }


module.exports.logoutAdmin = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}
