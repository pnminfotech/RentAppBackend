const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const connectToMongoDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://akshatabhimnale:RadheKrishna$$12@cluster0.k4yrvjb.mongodb.net/StockManagementSystem"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const client = new MongoClient(
  "mongodb+srv://akshatabhimnale:RadheKrishna$$12@cluster0.k4yrvjb.mongodb.net/StockManagementSystem"
);

module.exports = { connectToMongoDB, client };
