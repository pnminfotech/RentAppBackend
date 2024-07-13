const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectToMongoDB } = require("./config/connection");
const routes = require("./routes");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

connectToMongoDB();

app.use("/api/", routes);

app.use("/uploads", express.static(uploadDir));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something broke!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
