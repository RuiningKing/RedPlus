const express = require("express");
const {
  getAllBloodRequsts,
  postBloodRequest
} = require("../../controllers/bloodController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect("user"), getAllBloodRequsts);
router.post("/", protect("user"), postBloodRequest);

module.exports = router;
