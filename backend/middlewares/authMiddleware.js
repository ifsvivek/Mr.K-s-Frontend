const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListTokenModel.js');
const adminModel = require('../models/adminModel.js');
const userModel = require('../models/userModel.js');

module.exports.authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const isBlacklisted = await blackListTokenModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decoded._id);

        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized: Admin not found' });
        }

        req.admin = admin;
        next();

    } catch (err) {
        console.error("AuthAdmin Error:", err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorize' });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorizedd' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorizeddd' });
    }
};
