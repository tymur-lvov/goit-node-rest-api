import express from "express";

import controllers from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../decorators/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", isValidId, controllers.getOneContact);

contactsRouter.delete("/:id", controllers.deleteContact);

contactsRouter.post("/", validateBody(), controllers.createContact);

contactsRouter.put("/:id", controllers.updateContact);

export default contactsRouter;
