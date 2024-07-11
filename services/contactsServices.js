import Contact from "../db/models/Contact.js";

const listContacts = () => Contact.find();

const getContactById = (filter) => Contact.findOne(filter);

const removeContact = (filter) => Contact.findOneAndDelete(filter);

const addContact = (body) => Contact.create(body);

const updateContact = (filter, body) => Contact.findOneAndUpdate(filter, body);

const updateStatusContact = (filter, body) => {
  return Contact.findOneAndUpdate(filter, body);
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
