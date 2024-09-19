const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/User") // Adjust the path as necessary
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body; // Get username and password from request body

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

    // Create a new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save(); // Save the user to the database
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});

module.exports = router;
//  "$2b$10$ZXRM4qfnAHriTRZGKae.NeJaHVnOXoKfkK8wpHnDTMQh3lsCfIBym"