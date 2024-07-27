import express from 'express';

import isEmptyBody from '../middlewares/isEmptyBody.js';
import upload from '../middlewares/upload.js';
import authenticate from '../middlewares/authinticate.js';
import authControllers from '../controllers/authControllers.js';
import validateBody from '../decorators/validateBody.js';
import {
  authSignupSchema,
  authSigninSchema,
  authRefreshTokenSchema,
} from '../validation/authSchemas.js';

const authRouter = express.Router();

authRouter.get('/verify/:verificationToken', authControllers.verify);

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

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authControllers.updateAvatar
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
