import * as services from "../services/contactsservices.js";
import * as schemas from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const data = await services.listContacts();

    res.json({
      code: 200,
      message: "success",
      data,
    });
  } catch (error) {}
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await services.getContactById(id);

    if (data === null) {
      return res.status(404).json({
        code: 404,
        message: "Not found",
      });
    }

    res.json({
      code: 200,
      message: "success",
      data,
    });
  } catch (error) {}
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await services.removeContact(id);

    if (data === null) {
      return res.status(404).json({
        code: 404,
        message: "Not found",
      });
    }

    res.status(200).json({
      code: 200,
      message: "success",
      data,
    });
  } catch (error) {}
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    await schemas.createContactSchema.validateAsync({
      name,
      email,
      phone,
    });

    const data = await services.addContact(name, email, phone);

    res.status(201).json({
      code: 201,
      message: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message.replace(/"/g, ""),
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Body must have at least one field",
      });
    }

    await schemas.updateContactSchema.validateAsync({ name, email, phone });

    const data = await services.updateContact(id, name, email, phone);

    if (data === null) {
      return res.status(404).json({
        code: 404,
        message: "Not found",
      });
    }

    res.json({
      code: 200,
      message: "success",
      data,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      message: error.message.replace(/"/g, ""),
    });
  }
};
