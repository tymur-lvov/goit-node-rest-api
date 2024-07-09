import mongoose from "mongoose";
import "dotenv/config";

import env from "../utils/env.js";

const initMongodbConnection = async () => {
  try {
    const user = env("MONGODB_USER");
    const password = env("MONGODB_PASSWORD");
    const url = env("MONGODB_URL");
    const name = env("MONGODB_NAME");
    const DB_HOST = `mongodb+srv://${user}:${password}@${url}/${name}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(DB_HOST);

    console.log("Database connection successful");
  } catch (error) {
    console.log(`Connection error ${error.message}`);

    process.exit(1);

    throw error;
  }
};

export default initMongodbConnection;
