import mongoose from "mongoose";
import { DB_URI_ONLINE } from "../../config/config.service.js";

const checkConnection = async () => {
  try {
    await mongoose.connect(DB_URI_ONLINE);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB Failed to connect");
  }
};
export default checkConnection;
