const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://akshatabhimnale:RadheKrishna$$12@cluster0.k4yrvjb.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connectToMongoDB, client };
