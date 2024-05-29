// server.js
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const { connectToMongoDB } = require("./config/connection");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
connectToMongoDB();

// Define your API routes here
app.use("/admin/api/", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
