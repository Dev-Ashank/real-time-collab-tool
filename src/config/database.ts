import mongoose from "mongoose";
import logger from "./logger";
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB Connected", {
      info: "Database Connection is established successfully",
    });
  } catch (error) {
    logger.error("Error in connecting MongoDB:", { error: error });
    process.exit(1);
  }
};
export default connectDB;
