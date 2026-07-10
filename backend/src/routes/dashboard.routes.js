const express = require("express");
const { getDashboardStats } = require("../controllers/dashboard.controller");
const protect = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/stats", protect, authorize("ADMIN", "MANAGER"), getDashboardStats);

module.exports = router;
