import pkg from "mongoose";
import dotenv from "dotenv";
const { connect, connection, set } = pkg;
dotenv.config();
const getUrl = async() => {
  const DB_HOST = process.env.DB_HOST || "localhost";
  const DB_PORT = process.env.DB_PORT || 27017;
  const DB_DATABASE = process.env.DB_DATABASE || "files_manager";
  const url = process.env.MONGO_URL || `mongodb://${DB_HOST}:${DB_PORT}`;
  await connectDB(url);
};
const connectDB = async (url) => {
  try {
    connection.once("open", () => console.log("MongoDB connected"));
    set("strictQuery", false);
    return connect(url);
  } catch (e) {
    process.exit(1);
  }
};

export default getUrl;
