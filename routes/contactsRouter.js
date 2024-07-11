import express from "express";

import isValidId from "../middlewares/isValidId.js";
import isEmptyBody from "../middlewares/isEmptyBody.js";
import validateBody from "../decorators/validateBody.js";
import controllers from "../controllers/contactsControllers.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", isValidId, controllers.getOneContact);

contactsRouter.delete("/:id", isValidId, controllers.deleteContact);

contactsRouter.put("/:id", isValidId, isEmptyBody, controllers.updateContact);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  controllers.patchContact,
);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  controllers.createContact,
);

export default contactsRouter;
