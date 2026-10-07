const Education = require("../models/education.model");
const educationSchema = require("../validators/education.validator");

const createEducation = async (req, res) => {
  try {
    const { error, value } = educationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const education = await Education.create(value);

    res.status(201).json({
      message: "Education created successfully",
      data: education,
    });
  } catch (error) {
    console.error("Create education error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Educations fetched successfully",
      data: educations,
    });
  } catch (error) {
    console.error("Get educations error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getEducationById = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
      });
    }

    res.status(200).json({
      message: "Education fetched successfully",
      data: education,
    });
  } catch (error) {
    console.error("Get education error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = educationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const education = await Education.findByIdAndUpdate(
      id,
      value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
      });
    }

    res.status(200).json({
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    console.error("Update education error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;

    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return res.status(404).json({
        message: "Education not found",
      });
    }

    res.status(200).json({
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Delete education error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
};