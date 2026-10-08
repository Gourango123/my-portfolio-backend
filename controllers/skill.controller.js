const mongoose = require("mongoose");

const Skill = require("../models/skill.model");
const skillSchema = require("../validators/skill.validator");

const createSkill = async (req, res) => {
  try {
    const { error, value } = skillSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const existingSkill = await Skill.findOne({
      name: value.name,
    });

    if (existingSkill) {
      return res.status(409).json({
        message: "Skill already exists",
      });
    }

    const skill = await Skill.create(value);

    return res.status(201).json({
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Create skill error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Skills fetched successfully",
      data: skills,
    });
  } catch (error) {
    console.error("Get skills error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      message: "Skill fetched successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Get skill error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const { error, value } = skillSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const existingSkill = await Skill.findOne({
      name: value.name,
      _id: { $ne: id },
    });

    if (existingSkill) {
      return res.status(409).json({
        message: "Skill already exists",
      });
    }

    const skill = await Skill.findByIdAndUpdate(
      id,
      value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Update skill error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};