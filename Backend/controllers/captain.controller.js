const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.services');
const { validationResult } = require("express-validator");


module.exports.registerCaptain = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    

    const { fullname, email, password, vehicleColor, vehicleNumber, capacity, vehicleType, location } = req.body;
    const isCaptainExist = await captainModel.findOne({ email });
    if (isCaptainExist) {
        return res.status(400).json({ message: "Captain already exist" });
    }
    
    const hashedPassword = await captainModel.hashPassword(password);

    const captainData = {



        fullname: {
            firstName:fullname.firstName,
            lastName:fullname.lastName
        },
        email,
        password: hashedPassword,
        capacity,
        vehicleType, 
        vehicleNumber,
        vehicleColor,
        location:
        {
            longitude: location.longitude,
            latitude: location.latitude
        }
    }
    const captain = await captainService.createCaptain(captainData);
    const token = await captain.generateAuthToken();
    return res.status(201).json({ token, captain });

}
