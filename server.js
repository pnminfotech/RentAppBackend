// server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectToMongoDB } = require("./config/connection");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

connectToMongoDB();

// Define your API routes here
app.use("/api/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
