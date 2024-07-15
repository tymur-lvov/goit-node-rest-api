import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as services from '../services/authServices.js';
import controllerDecorator from '../decorators/controllerDecorator.js';
import httpError from '../utils/httpError.js';

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await services.findUser({ email });
  if (user) {
    throw httpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await services.signup({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    Status: '201 Created',
    'Content-Type': 'application/json',
    ResponseBody: {
      user: {
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
    throw httpError(401, 'Email or password invalid');
  }

  const { _id: id } = user;

  const payload = { id };

  const acccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    Status: '200 OK',
    'Content-Type': 'application/json',
    ResponseBody: {
      token: acccessToken,
      user: {
        email,
        subscription: 'starter',
      },
    },
  });
};

export default {
  signup: controllerDecorator(signup),
  signin: controllerDecorator(signin),
};
