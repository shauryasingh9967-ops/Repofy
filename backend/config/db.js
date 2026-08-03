import mongoose from "mongoose";
import dns from "node:dns";

if (dns.getServers().includes("127.0.0.1")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/repofy";

  try {
    await mongoose.connect(uri);

    console.log(
      `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;  