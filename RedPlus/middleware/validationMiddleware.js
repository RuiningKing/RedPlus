const asyncHandler = require("express-async-handler");
const { phone: phonenumber } = require("phone");
const validator = require("validator");

const validateLogin = asyncHandler((req, res, next) => {
  const { phone, password } = req.body;
  if (!phonenumber(phone).isValid) throw new Error("Invalid phone number");
  if (!password || !validator.isLength(password, { min: 4 }))
    throw new Error("Invalid password");
  next();
});

const validateRegister = asyncHandler((req, res, next) => {
  const { name, email, phone, password, location, bloodType } = req.body;
  res.status(400);
  if (!name || !validator.isLength(name, { min: 3 }))
    throw new Error("Invalid name");
  else if (email && !validator.isEmail(email)) throw new Error("Invalid email");
  else if (!phone || !phonenumber(phone).isValid)
    throw new Error("Invalid phone number");
  else if (!password || !validator.isLength(password, { min: 4 }))
    throw new Error("Invalid password");
  else if (!location || !location.lat || !location.lng)
    throw new Error("Invalid geolocation");
  else if (
    !bloodType ||
    !validator.isIn(bloodType, [
      "O-",
      "O+",
      "B-",
      "B+",
      "A-",
      "A+",
      "AB-",
      "AB+"
    ])
  )
    throw new Error("Invalid blood type");
  else {
    res.status(200);
    next();
  }
});

module.exports = {
  validateLogin,
  validateRegister
};
