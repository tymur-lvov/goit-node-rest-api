import express from 'express';

import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../decorators/validateBody.js';
import authControllers from '../controllers/authControllers.js';
import authenticate from '../middlewares/authinticate.js';
import {
  authSignupSchema,
  authSigninSchema,
  authRefreshTokenSchema,
} from '../validation/authSchemas.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.post(
  '/login',
  isEmptyBody,
  validateBody(authSigninSchema),
  authControllers.signin
);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post(
  '/refresh',
  isEmptyBody,
  validateBody(authRefreshTokenSchema),
  authControllers.refresh
);

authRouter.post('/logout', authenticate, authControllers.signout);

export default authRouter;
