const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
  createEducation,
  updateEducation,
  deleteEducation,
  getEducationById,
  getEducations,
} = require("../controllers/education.controller");

const router = express.Router();

router.post("/", authMiddleware, createEducation);

router.get("/", getEducations);

router.get("/:id", getEducationById);

router.put("/:id", authMiddleware, updateEducation);

router.delete("/:id", authMiddleware, deleteEducation);

module.exports = router;