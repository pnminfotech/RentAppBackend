const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in .env file.");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = { connectToMongoDB };




// const mongoose = require("mongoose");
// const { MongoClient } = require("mongodb");

// const connectToMongoDB = async () => {
//   try {
//     const conn = await mongoose.connect(
//       "mongodb+srv://pnminfotech2024:hxkTifGMN732PLKi@rentapp.rnfrr.mongodb.net/${username}?retryWrites=true&w=majority&appName=RentApp"
//     );
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error(`Error connecting to MongoDB: ${err.message}`);
//     process.exit(1);
//   }
// };

// const client = new MongoClient(
//   "mongodb+srv://pnminfotech2024:hxkTifGMN732PLKi@rentapp.rnfrr.mongodb.net/${username}?retryWrites=true&w=majority&appName=RentApp"
// );

// module.exports = { connectToMongoDB, client };
