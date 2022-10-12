const express = require("express");
const router = express.Router();

router.use("/users", require("./users/auth"));
router.use("/blood", require("./blood/bloodRequests"));
router.use("/blood/donation", require("./blood/donation"));
router.use("/blood/facility", require("./blood/facility"));

module.exports = router;
