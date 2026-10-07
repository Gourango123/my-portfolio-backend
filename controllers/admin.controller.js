const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin.model");

// model
const Project = require("../models/project.model");
const Skill = require("../models/skill.model");
const Experience = require("../models/experience.model");
const Education = require("../models/education.model");
const Message = require("../models/message.model");
const Resume = require("../models/resume.model");


const {
  adminRegisterSchema,
  adminLoginSchema,
} = require("../validators/admin.validator");

const registerAdmin = async (req, res) => {
  try {
    const { error, value } = adminRegisterSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { name, email, password } = value;

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { error, value } = adminLoginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      },
    );

    const refreshToken = jwt.sign(
      {
        adminId: admin._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
      },
    );

    admin.refreshToken = refreshToken;
    await admin.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    if (admin.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const accessToken = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      },
    );

    res.status(200).json({
      message: "Access token refreshed",
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const admin = await Admin.findOne({ refreshToken });

      if (admin) {
        admin.refreshToken = null;
        await admin.save();
      }
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select(
      "-password -refreshToken",
    );

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admin fetched successfully",
      admin,
    });
  } catch (error) {
    console.error("Get current admin error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      totalSkills,
      totalExperiences,
      totalEducations,
      totalMessages,
      totalResumes,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Message.countDocuments(),
      Resume.countDocuments(),
    ]);

    res.status(200).json({
      message: "Dashboard statistics fetched successfully",
      data: {
        totalProjects,
        totalSkills,
        totalExperiences,
        totalEducations,
        totalMessages,
        totalResumes,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getRecentData = async (req, res) => {
  try {
    const [projects, messages, experiences, skills] = await Promise.all([
      Project.find()
        .sort({ createdAt: -1 })
        .limit(5),

      Message.find()
        .sort({ createdAt: -1 })
        .limit(5),

      Experience.find()
        .sort({ createdAt: -1 })
        .limit(5),

      Skill.find()
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      message: "Recent data fetched successfully",
      data: {
        projects,
        messages,
        experiences,
        skills,
      },
    });
  } catch (error) {
    console.error("Get recent data error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { 
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  getCurrentAdmin,
  getDashboardStats,
  getRecentData
};
