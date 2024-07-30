import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';

import controllerDecorator from '../decorators/controllerDecorator.js';
import resizeAvatar from '../middlewares/resizeAvatar.js';
import * as services from '../services/authServices.js';
import httpError from '../utils/httpError.js';
import sendEmail from '../utils/sendEmail.js';

const { JWT_SECRET, BASE_URL } = process.env;
const avatarsPath = path.resolve('public', 'avatars');

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await services.findUser({ verificationToken });

  if (!user) {
    throw httpError(404, 'User not found');
  }

  await services.updateUser(
    { _id: user.id },
    {
      verificationToken: null,
      verify: true,
    }
  );

  res.json({
    Status: '200 OK',
    ResponseBody: {
      message: 'Verification successfull',
    },
  });
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = nanoid();
  const user = await services.findUser({ email });

  if (user) {
    throw httpError(409, 'Email in use');
  }

  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await services.signup({
    ...req.body,
    avatarURL,
    password: hashPassword,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: 'Please verify your email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click here to verify your email</a>`,
  };

  sendEmail(verifyEmail);

  res.status(201).json({
    Status: '201 Created',
    ResponseBody: {
      user: {
        avatarURL,
        email,
        subscription: 'starter',
      },
    },
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await services.findUser({ email });

  if (!user) {
    throw httpError(404, 'Email not found');
  }
  if (user.verify) {
    throw httpError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    subject: 'Please verify your email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: 'Verify email resend successfully',
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await services.findUser({ email });

  if (!user) {
    throw httpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw httpError(401, 'Email verification is required');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw httpError(401, 'Email or password is wrong');
  }

  const { _id: id } = user;
  const payload = { id };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  await services.updateUser({ _id: id }, { accessToken, refreshToken });

  res.json({
    Status: '200 OK',
    ResponseBody: {
      token: accessToken,
      user: {
        email,
        subscription: 'starter',
      },
    },
  });
};

const updateAvatar = async (req, res, next) => {
  try {
    const avatar = await resizeAvatar(req.file);

    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);

    await fs.rename(oldPath, newPath);

    const avatarURL = path.join('avatars', req.file.filename);
    const { _id: owner } = req.user;
    const data = await services.updateUser(owner, { avatarURL });

    res.json({
      Status: '200 OK',
      ResponseBody: {
        avatarURL,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getCurrent = async (req, res) => {
  const { username, email, subscription } = req.user;

  res.json({
    Status: '200 OK',
    ResponseBody: {
      email,
      subscription,
    },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const payload = { id };
    const acccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      acccessToken,
      refreshToken,
    });
  } catch (error) {
    next(httpError(403, 'Refresh token invalid'));
  }
};

const signout = async (req, res) => {
  const { _id } = req.user;
  if (!req.user.refreshToken) {
    throw httpError(403, 'User already signout');
  }

  await services.updateUser({ _id }, { accessToken: '', refreshToken: '' });

  res.status(204).json();
};

export default {
  verify: controllerDecorator(verify),
  resendVerify: controllerDecorator(resendVerify),
  signup: controllerDecorator(signup),
  signin: controllerDecorator(signin),
  getCurrent: controllerDecorator(getCurrent),
  refresh: controllerDecorator(refresh),
  signout: controllerDecorator(signout),
  updateAvatar,
};
