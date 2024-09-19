const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectToMongoDB } = require("./config/connection");
const routes = require("./routes");
const fs = require("fs");
const path = require("path");
const User = require("./models/User");
const passwordRoutes = require("./checkPassWord")
const userRoutes = require("./userRoutes"); 

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/password", passwordRoutes);
app.use("/api/users", userRoutes);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

connectToMongoDB();

app.use("/api/", routes);

// app.post("/api/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find the user by username
//     const user = await User.findOne({ username: username });

//     if (!user) {
//       // If the user is not found
//       return res.json({ success: false, message: "Invalid username or password" });
//     }

//     // Compare the provided password with the stored password
//     if (user.password === password) {
//       return res.json({ success: true, message: "Login successful" });
//     } else {
//       return res.json({ success: false, message: "Invalid username or password" });
//     }
//   } catch (err) {
//     // Handle any errors that occurred during the process
//     console.error("Error during login:", err);
//     res.status(500).json({ message: "An error occurred during login", error: err.message });
//   }
// });
app.use("/uploads", express.static(uploadDir));
// app.use("/api/flats", flatRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something broke!" + err });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
