const Experience = require("../models/experience.model");
const experienceSchema = require("../validators/experience.validator");

const createExperience = async (req, res) => {
  try {
    const { error, value } = experienceSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const experience = await Experience.create(value);

    res.status(201).json({
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Create experience error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Experiences fetched successfully",
      data: experiences,
    });
  } catch (error) {
    console.error("Get experiences error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience fetched successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Get experience error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = experienceSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const experience = await Experience.findByIdAndUpdate(
      id,
      value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Update experience error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};