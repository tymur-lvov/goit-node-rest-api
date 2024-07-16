import Joi from 'joi';

export const authSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authSigninSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authRefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
