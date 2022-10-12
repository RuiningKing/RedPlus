const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { default: mongoose } = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, diseases, location, bloodType } =
    req.body;
  if (!name || !phone || !password || !location) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    diseases,
    location: {
      coordinates: [location.lng, location.lat]
    },
    bloodType
  });

  if (user) {
    res.status(201).json({
      token: generateToken({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        bloodType: user.bloodType,
        role: user.role
      })
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  // Check for user email
  const user = await User.findOne({ phone }).select("+password");

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      token: generateToken({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        bloodType: user.bloodType,
        role: user.role
      })
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const nots = await Notification.find({
    user: userId
  });
  res.status(200);
  res.send(nots);
});

const readNotifications = asyncHandler(async (req, res) => {
  const { Id } = req.params;
  const { _id: userId } = req.user;
  const not = await Notification.findById(Id);
  if (not.user.equals(userId)) {
    not.read = true;
    const newNot = await not.save();
    res.status(200);
    res.send(newNot);
  } else {
    res.status(401);
  }
});

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

module.exports = {
  registerUser,
  loginUser,
  getNotifications,
  readNotifications
};
