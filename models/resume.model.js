const Resume = require("../models/resume.model");
const cloudinary = require("../config/cloudinary");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF file is required",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    const existingResume = await Resume.findOne();

    if (existingResume) {
      await cloudinary.uploader.destroy(
        existingResume.publicId,
        {
          resource_type: "image",
        }
      );

      await Resume.findByIdAndDelete(existingResume._id);
    }

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "portfolio/resume",
          public_id: "resume",
          overwrite: true,
          format: "pdf",
        },
        async (error, result) => {
          if (error) {
            console.error(
              "Cloudinary upload error:",
              error.message
            );

            return res.status(500).json({
              message: "Resume upload failed",
            });
          }

          const resume = await Resume.create({
            name: req.file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
          });

          return res.status(201).json({
            message: "Resume uploaded successfully",
            data: resume,
          });
        }
      );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error(
      "Upload resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      data: resume,
    });
  } catch (error) {
    console.error(
      "Get resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.redirect(resume.url);
  } catch (error) {
    console.error(
      "Download resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to download resume",
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await cloudinary.uploader.destroy(
      resume.publicId,
      {
        resource_type: "image",
      }
    );

    await Resume.findByIdAndDelete(resume._id);

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  uploadResume,
  getResume,
  downloadResume,
  deleteResume,
};