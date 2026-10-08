const About = require("../models/about.model");
const aboutSchema = require("../validators/about.validator");

const createAbout = async (req, res) => {
  try {
    const existingAbout = await About.findOne();

    if (existingAbout) {
      return res.status(409).json({
        message: "About section already exists",
      });
    }

    const { error, value } = aboutSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const about = await About.create(value);

    return res.status(201).json({
      message: "About section created successfully",
      data: about,
    });
  } catch (error) {
    console.error("Create about error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: "About section not found",
      });
    }

    return res.status(200).json({
      message: "About section fetched successfully",
      data: about,
    });
  } catch (error) {
    console.error("Get about error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateAbout = async (req, res) => {
  try {
    const { error, value } = aboutSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const about = await About.findOneAndUpdate(
      {},
      value,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!about) {
      return res.status(404).json({
        message: "About section not found",
      });
    }

    return res.status(200).json({
      message: "About section updated successfully",
      data: about,
    });
  } catch (error) {
    console.error("Update about error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOneAndDelete();

    if (!about) {
      return res.status(404).json({
        message: "About section not found",
      });
    }

    return res.status(200).json({
      message: "About section deleted successfully",
    });
  } catch (error) {
    console.error("Delete about error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout,
};