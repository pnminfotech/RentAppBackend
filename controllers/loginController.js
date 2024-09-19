const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Import the User model

exports.handleLogin = async (req, res) => {
  console.log("Login request received with body:", req.body);

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    console.log("User found:", user); // Log user data

    if (user) {
      console.log("Comparing password:", password, "with hashed:", user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);

      if (isMatch) {
        return res.send({ success: true, message: "Login successful" });
      }
    }
    return res.send({ success: false, message: "Invalid username or password" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
