const express = require("express");
const { getFacility } = require("../../controllers/bloodController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFacility);

module.exports = router;
