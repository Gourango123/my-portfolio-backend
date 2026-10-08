const Joi = require("joi");

const skillSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  category: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  level: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .required(),

  icon: Joi.string()
    .trim()
    .allow("")
    .optional(),
});

module.exports = skillSchema;