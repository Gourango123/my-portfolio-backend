const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const messageRouter = require("./routes/message.route");
const adminRouter = require("./routes/admin.route");
const projectRouter = require("./routes/project.route");
const skillRouter = require("./routes/skill.route");
const experienceRouter = require("./routes/experience.route");
const educationRouter = require("./routes/education.route");
const resumeRouter = require("./routes/resume.route");
const aboutRouter = require("./routes/about.route");

const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://my-portfolio-frontend-dusky.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/messages", messageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/projects", projectRouter);
app.use("/api/skills", skillRouter);
app.use("/api/experiences", experienceRouter);
app.use("/api/educations", educationRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/about", aboutRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API is running",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;