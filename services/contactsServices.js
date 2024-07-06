import fs from "fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");

  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contactsList = JSON.parse(data);

  const contact = contactsList.find((contact) => contact.id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contactsList = JSON.parse(data);

  const contact = contactsList.find((contact) => contact.id === contactId);
  const filteredList = contactsList.filter(
    (contact) => contact.id !== contactId,
  );

  await fs.writeFile(contactsPath, JSON.stringify(filteredList, null, 2));

  return contact || null;
};

const addContact = async (name, email, phone) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contactsList = JSON.parse(data);

  const newContact = { id: nanoid(), name, email, phone };
  contactsList.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));

  return newContact;
};

const updateContact = async (id, name, email, phone) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contactsList = JSON.parse(data);

  const indexOfContactToUpdate = contactsList.findIndex(
    (contact) => contact.id === id,
  );

  if (indexOfContactToUpdate === -1) return null;

  const oldContact = contactsList[indexOfContactToUpdate];

  const newContact = {
    id,
    name: name ? name : oldContact.name,
    email: email ? email : oldContact.email,
    phone: phone ? phone : oldContact.phone,
  };

  contactsList[indexOfContactToUpdate] = newContact;

  await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));

  return newContact;
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
