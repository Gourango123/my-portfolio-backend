const Joi = require("joi");

const experienceSchema = Joi.object({
  company: Joi.string().trim().min(2).max(100).required(),
  position: Joi.string().trim().min(2).max(100).required(),
  location: Joi.string().trim().min(2).max(100).required(),
  startDate: Joi.string().trim().min(2).max(30).required(),
  endDate: Joi.string().trim().max(30).allow("").default("Present"),
  description: Joi.string().trim().min(10).max(1000).required(),
  technologies: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required(),
});

module.exports = experienceSchema;