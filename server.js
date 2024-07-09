import express from "express";
import morgan from "morgan";
import cors from "cors";

import errorHandler from "./middlewares/errorHandler.js";
import contactsRouter from "./routes/contactsRouter.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

const startServer = () => {
  const app = express();

  app.use(morgan("tiny"));

  app.use(cors());

  app.use(express.json());

  app.use("/api/contacts", contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
  });
};

export default startServer;
