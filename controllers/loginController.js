const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import the User model


// When creating or saving the user:
// const saltRounds = 10;
// const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

// Save the hashedPassword to your MongoDB database instead of the plain text password.

exports.handleLogin = async (req, res) => {
  console.log("Login request received with body:", req.body); // Log request body

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("User found:", user); // Log user data

    if (user) {
      // Compare the hashed password in the database with the plain-text password entered by the user
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.send({ success: true, message: "Login successful" });
      } else {
        res.send({ success: false, message: "Invalid username or password" });
      }
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};