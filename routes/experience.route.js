const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
  createExperience,
  updateExperience,
  deleteExperience,
  getExperienceById,
  getExperiences,
} = require("../controllers/experience.controller");

const router = express.Router();

router.post("/", authMiddleware, createExperience);

router.get("/", getExperiences);

router.get("/:id", getExperienceById);

router.put("/:id", authMiddleware, updateExperience);

router.delete("/:id", authMiddleware, deleteExperience);

module.exports = router;