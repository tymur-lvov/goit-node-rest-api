import mongoose from "mongoose";
import "dotenv/config";

import env from "../utils/env.js";

const initMongodbConnection = async () => {
  try {
    const user = env("MONGODB_USER");
    const password = env("MONGODB_PASSWORD");
    const url = env("MONGODB_URL");
    const DB_HOST = `mongodb+srv://${user}:${password}@${url}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(DB_HOST);

    console.log("Successfully connection to MongoDB");
  } catch (error) {
    console.log(`Connection error ${error.message}`);
    throw error;
  }
};

export default initMongodbConnection;
