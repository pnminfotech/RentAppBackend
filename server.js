// server.js
const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./config/connection");
const adminRoutes = require("./routes/adminRoutes");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
connectToMongoDB();

// Define your API routes here
app.use("/admin/api/", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
