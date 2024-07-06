import * as services from "../services/contactsservices.js";

export const getAllContacts = async (req, res) => {
  const data = await services.listContacts();

  res.json({
    code: 200,
    message: "success",
    data,
  });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  const data = await services.getContactById(id);

  res.json({
    code: 200,
    message: "success",
    data,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  const data = await services.removeContact(id);

  res.status(200).json({
    code: 200,
    message: "success",
    data,
  });
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const data = await services.addContact(name, email, phone);

  res.status(201).json({
    code: 201,
    message: "success",
    data,
  });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const data = await services.updateContact(id, name, email, phone);

  res.json({
    code: 200,
    message: "success",
    data,
  });
};
