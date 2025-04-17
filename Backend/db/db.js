const mongoose = require("mongoose");

async function connectToDB() {
  const url = process.env.MONGO_URI;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    family: 4, // Use IPv4, skip trying IPv6
  };

  try {
    await mongoose.connect(url, options);
    console.log("Connected to MongoDB");
    return true;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    // If we're in development, create a mock in-memory MongoDB
    if (process.env.NODE_ENV !== "production") {
      console.log("Setting up in-memory MongoDB for development...");
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, options);
      console.log("Connected to in-memory MongoDB");
      return true;
    }
    return false;
  }
}

module.exports = connectToDB;
