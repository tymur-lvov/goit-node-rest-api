import express from 'express';

import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../decorators/validateBody.js';
import authControllers from '../controllers/authControllers.js';
import {
  authSignupSchema,
  authSigninSchema,
} from '../validation/authSchemas.js';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.post('/signin', isEmptyBody, validateBody(authSigninSchema));

export default authRouter;
