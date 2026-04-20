import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("Connected to database successfully");
});
db.on("error", (err) => {
  console.log("Mongodb connection error : ", err);
});
db.on("disconnected", () => {
  console.log("Disconnected successfully");
});
export default db;
