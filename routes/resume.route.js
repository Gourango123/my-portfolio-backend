const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  uploadResume,
  getResume,
  deleteResume,
} = require("../controllers/resume.controller");

const router = express.Router();

router.post("/", authMiddleware, upload.single("resume"), uploadResume);

router.get("/", getResume);

router.delete("/", authMiddleware, deleteResume);

module.exports = router;
