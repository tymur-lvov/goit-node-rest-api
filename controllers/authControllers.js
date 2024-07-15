import controllerDecorator from '../decorators/controllerDecorator.js';

const signup = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
};

export default {
  signup: controllerDecorator(signup),
};
