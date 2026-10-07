const Joi = require("joi");

const educationSchema = Joi.object({
  institution: Joi.string().trim().min(2).max(150).required(),
  degree: Joi.string().trim().min(2).max(100).required(),
  field: Joi.string().trim().min(2).max(100).required(),
  location: Joi.string().trim().min(2).max(100).required(),
  startDate: Joi.string().trim().min(2).max(30).required(),
  endDate: Joi.string().trim().min(2).max(30).required(),
  description: Joi.string().trim().max(1000).allow("").optional(),
  grade: Joi.string().trim().max(50).allow("").optional(),
});

module.exports = educationSchema;