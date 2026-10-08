const express = require("express");

const {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout,
} = require("../controllers/about.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createAbout);
router.get("/", getAbout);
router.put("/", authMiddleware, updateAbout);
router.delete("/", authMiddleware, deleteAbout);

module.exports = router;