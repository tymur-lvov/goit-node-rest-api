import httpError from '../utils/httpError.js';

const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });

      next();
    } catch (error) {
      console.log(error.message);

      next(httpError(400, error.message));
    }
  };
};

export default validateBody;
