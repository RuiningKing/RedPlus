const express = require("express");
const {
  postDonation,
  acceptDonation,
  transferDonationToFacility,
  postDonationFacility,
  getPendingDonations
} = require("../../controllers/bloodController");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect("user"), postDonation);
router.post("/facility", protect("user"), postDonationFacility);
router.post("/accept", protect("expert"), acceptDonation);
router.post("/transfer", protect("expert"), transferDonationToFacility);
router.post("/pending", protect("expert"), getPendingDonations);

router.get("/", protect("expert"), getPendingDonations);

module.exports = router;
