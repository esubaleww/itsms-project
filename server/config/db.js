import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting MongoDB:", error.message);
    throw error;
  }
};
export default connectDB;
