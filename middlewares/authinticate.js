import jwt from 'jsonwebtoken';

import httpError from '../utils/httpError.js';

import { findUser } from '../services/authServices.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(httpError(401, 'Authorization header not found'));
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    return next(httpError(401, 'Bearer not found'));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findUser({ _id: id });

    if (!user) {
      return next(httpError(401, 'User not found'));
    }

    // if (!user.accessToken) {
    //   return next(httpError(401, 'User already signout'));
    // }

    req.user = user;

    next();
  } catch (error) {
    next(httpError(401, error.message));
  }
};

export default authenticate;
