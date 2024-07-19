import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import fs from 'node:fs/promises';
import path from 'node:path';

import * as services from '../services/authServices.js';
import controllerDecorator from '../decorators/controllerDecorator.js';
import httpError from '../utils/httpError.js';

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const signup = async (req, res) => {
  const { email, password } = req.body;
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
  });

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

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await services.findUser({ email });

  if (!user) {
    throw httpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw httpError(401, 'Email or password is wrong');
  }

  const { _id: id } = user;
  const payload = { id };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
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
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);

    await fs.rename(oldPath, newPath);

    const avatarURL = path.join('avatars', filename);
    const { _id: owner } = req.user;
    const data = await services.updateUser(owner, { avatarURL });

    res.json({
      Status: '200 OK',
      ResponseBody: {
        avatarURL,
      },
    });
  } catch (error) {
    await fs.unlink(req.file.path);

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
    const acccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
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
  signup: controllerDecorator(signup),
  signin: controllerDecorator(signin),
  getCurrent: controllerDecorator(getCurrent),
  refresh: controllerDecorator(refresh),
  signout: controllerDecorator(signout),
  updateAvatar,
};
