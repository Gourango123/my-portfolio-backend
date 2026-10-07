const Joi = require("joi");

const projectSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(1000).required(),
  image: Joi.string().trim().uri().required(),
  technologies: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required(),
  github: Joi.string().trim().uri().required(),
  live: Joi.string().trim().uri().required(),
});

module.exports = projectSchema;