const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const connectToMongoDB = async () => {
  try {
    const conn = await mongoose.connect(
     "mongodb+srv://pnminfotech2024:hxkTifGMN732PLKi@rentapp.rnfrr.mongodb.net/?retryWrites=true&w=majority&appName=RentApp"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const client = new MongoClient(
  "mongodb+srv://pnminfotech2024:hxkTifGMN732PLKi@rentapp.rnfrr.mongodb.net/?retryWrites=true&w=majority&appName=RentApp"
);

module.exports = { connectToMongoDB, client };
