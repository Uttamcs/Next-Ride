const userModel = require('../models/user.model');
const userService = require('../services/user.services')
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklist-token.model')

module.exports.registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { fullname, email, password } = req.body;
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await userModel.hashPassword(password);
    

    const user = await userService.createUser({

        firstName:fullname.firstName,
        lastName:fullname.lastName,
        email,
        password: hashedPassword
    });
    const token = await user.generateAuthToken();
    res.status(201).json({ token, user });
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = await user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {
    return res.status(200).json(req.user); 
}

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out successfully' });
}