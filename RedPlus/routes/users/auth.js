const express = require("express");
const {
  registerUser,
  loginUser,
  getNotifications,
  readNotifications
} = require("../../controllers/authController");
const { protect } = require("../../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin
} = require("../../middleware/validationMiddleware");

const router = express.Router();

router.post("/login", validateLogin, loginUser);
router.post("/register", validateRegister, registerUser);
router.get("/notifications", protect("user"), getNotifications);
router.delete("/notifications/:Id", protect("user"), readNotifications);
// router.get("/me", protect("user"));
// router.get("/profile/:Id", protect("expert"));

module.exports = router;
