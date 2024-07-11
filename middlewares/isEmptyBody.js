import httpError from "../utils/httpError.js";

const isEmptyBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(httpError(400, "Body cannot be empty"));
  }

  next();
};

export default isEmptyBody;
