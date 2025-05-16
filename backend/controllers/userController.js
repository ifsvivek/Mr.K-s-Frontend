const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListTokenModel.js');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phoneNumber} = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {

        const hashedPassword = await userModel.hashPassword(password);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            phoneNumber,

        });

        await user.save();

        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}

module.exports.updateUserPassword = async (req, res, next) => {
    
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { oldPassword, newPassword } = req.body;
    
        const isMatch = await req.user.comparePassword(oldPassword);
    
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid old password' });
        }
    
        const hashedPassword = await userModel.hashPassword(newPassword);
    
        await userModel.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    
        res.status(200).json({ message: 'Password updated successfully' });
    
    }

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}

module.exports.updateUserProfile = async (req, res, next) => {
    try {
        const { name, email, profession, location, phone } = req.body;
        const userId = req.user._id;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { name, email, profession, location, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Profile updated successfully',
            user: updatedUser 
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports.verifyToken = async (req, res) => {
    try {
        // If we reach here, token is valid (already verified by authMiddleware)
        res.status(200).json({ 
            valid: true, 
            user: req.user 
        });
    } catch (error) {
        res.status(401).json({ 
            valid: false, 
            message: 'Invalid token' 
        });
    }
};
