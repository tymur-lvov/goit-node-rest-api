import httpError from '../utils/httpError.js';
import controllerDecorator from '../decorators/controllerDecorator.js';
import * as schemas from '../validation/contactsSchemas.js';
import * as services from '../services/contactsservices.js';

const getAllContacts = async (req, res) => {
  const data = await services.listContacts();

  if (!data) throw httpError(404, 'Not found');

  res.json({
    code: 200,
    message: 'success',
    data,
  });
};

const getOneContact = async (req, res) => {
  const { id: _id } = req.params;

  const data = await services.getContactById({ _id });

  if (!data) throw httpError(404, 'Not found');

  res.json({
    code: 200,
    message: 'success',
    data,
  });
};

const deleteContact = async (req, res) => {
  const { id: _id } = req.params;

  const data = await services.removeContact({ _id });

  if (!data) throw httpError(404, 'Not found');

  res.status(200).json({
    code: 200,
    message: 'success',
    data,
  });
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  await schemas.createContactSchema.validateAsync({
    name,
    email,
    phone,
  });

  const data = await services.addContact(req.body);

  if (!data) throw httpError(404, 'Not found');

  res.status(201).json({
    code: 201,
    message: 'success',
    data,
  });
};

const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { name, email, phone } = req.body;

  if (Object.keys(req.body).length === 0) {
    throw httpError(400, 'Body must have at least one field');
  }

  await schemas.updateContactSchema.validateAsync({ name, email, phone });

  const data = await services.updateContact({ _id }, req.body);

  if (!data) throw httpError(404, 'Not found');

  res.json({
    code: 200,
    message: 'success',
    data,
  });
};

const patchContact = async (req, res) => {
  const { id: _id } = req.params;
  const { name, email, phone } = req.body;

  if (Object.keys(req.body).length === 0) {
    throw httpError(400, 'Body must have at least one field');
  }
  await schemas.updateContactSchema.validateAsync({ name, email, phone });

  const data = await services.updateStatusContact({ _id }, req.body);

  if (!data) throw httpError(404, 'Not found');

  res.json({
    code: 200,
    message: 'success',
    data,
  });
};

export default {
  getAllContacts: controllerDecorator(getAllContacts),
  getOneContact: controllerDecorator(getOneContact),
  deleteContact: controllerDecorator(deleteContact),
  createContact: controllerDecorator(createContact),
  updateContact: controllerDecorator(updateContact),
  patchContact: controllerDecorator(patchContact),
};
