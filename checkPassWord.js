const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/hash-password", async (req, res) => {
  const { password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    res.json({ hashedPassword });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "Error hashing password" });
  }
});

module.exports = router; 

//to genrate password 
// const bcrypt = require("bcrypt");

// const password = "123456789"; // Plain text password
// const hashedPasswordFromDB = "$2b$10$ZXRM4qfnAHriTRZGKae.NeJaHVnOXoKfkK8wpHnDTMQh3lsCfIBym"; // Replace with actual hashed password from your database

// // Compare the plain password with the hashed password
// bcrypt.compare(password, hashedPasswordFromDB, function(err, result) {
//     if (err) throw err;
//     console.log(result); // true if the password matches, false otherwise
// });
