const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    }
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
    select: false, 
  },
  socketId: {
    type: String,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["car", "bike", "auto"],
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicleColor: {
    type: String,
    required: true,
  },
  location: {
    longitude: {
      // Fixed spelling from "lognitude" to "longitude"
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Generate Auth Token
captainSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Compare Passwords
captainSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Hash Password
captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("captain", captainSchema);
module.exports = captainModel;
