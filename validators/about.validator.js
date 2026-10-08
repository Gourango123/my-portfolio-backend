const Joi = require("joi");

const aboutSchema = Joi.object({
  label: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  title: Joi.string()
    .trim()
    .min(5)
    .max(150)
    .required(),

  highlight: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .min(20)
    .max(1000)
    .required(),

  features: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().optional(),

        icon: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required(),

        title: Joi.string()
          .trim()
          .min(2)
          .max(100)
          .required(),

        description: Joi.string()
          .trim()
          .min(10)
          .max(300)
          .required(),
      })
    )
    .min(1)
    .max(6)
    .required(),
});

module.exports = aboutSchema;