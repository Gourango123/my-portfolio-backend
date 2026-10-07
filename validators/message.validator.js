const Joi = require("joi");

const messageSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().trim().required(),
  subject: Joi.string().trim().min(3).max(100).required(),
  message: Joi.string().trim().min(10).max(1000).required(),
});

module.exports = messageSchema;