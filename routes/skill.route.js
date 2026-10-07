const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { createSkill, updateSkill, deleteSkill, getSkillById, getSkills } = require("../controllers/skill.controller");

const router = express.Router();

router.post("/", authMiddleware, createSkill);
router.get("/", getSkills);
router.get("/:id", getSkillById);
router.put("/:id", authMiddleware, updateSkill);
router.delete("/:id", authMiddleware, deleteSkill);

module.exports = router;
