import fs from 'fs/promises';
import path from 'node:path';

import httpError from '../utils/httpError.js';
import controllerDecorator from '../decorators/controllerDecorator.js';
import * as schemas from '../validation/contactsSchemas.js';
import * as services from '../services/contactsservices.js';

const avatarsPath = path.resolve('public', 'avatars');

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

const uploadAvatar = async (req, res, next) => {
  try {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);

    await fs.rename(oldPath, newPath);

    // const avatar = path.join('avatars', filename);
    // const { _id: owner } = req.user;
    // const data = await services.addSong({ ...req.body, avatar, owner });

    res.status(201).json({
      status: 201,
      message: `Avatar upload successfull`,
      // data,
    });
  } catch (error) {
    // await fs.unlink(req.file.path);
    throw error;
  }
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
  uploadAvatar,
};
