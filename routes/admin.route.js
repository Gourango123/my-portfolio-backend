const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  getCurrentAdmin,
  getDashboardStats,
  getRecentData,
} = require("../controllers/admin.controller");

const authMiddleware = require("../middleware/auth.middleware");
const { authLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/register", authLimiter , registerAdmin);
router.post("/login", authLimiter , loginAdmin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutAdmin);
router.get("/me", authMiddleware, getCurrentAdmin);
router.get("/dashboard-stats", authMiddleware, getDashboardStats);
router.get("/recent-data", authMiddleware, getRecentData);

module.exports = router;
