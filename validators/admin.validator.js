const Joi = require("joi");

const adminRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).max(30).required(),
});

const adminLoginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(6).max(30).required(),
});

module.exports = {
  adminRegisterSchema,
  adminLoginSchema,
};
