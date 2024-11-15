// // controllers/loginController.js
// const mongoose = require("mongoose");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// async function login(req, res) {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // Connect to user's database
//     const userDatabase = mongoose.createConnection(
//       `mongodb+srv://pnminfotech2024:hxkTifGMN732PLKi@rentapp.rnfrr.mongodb.net/${user.username}?retryWrites=true&w=majority&appName=RentApp`,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );

//     req.userDatabase = userDatabase;
//     res.status(200).json({ message: "Login successful", username: user.username });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ message: "Internal server error" });
    
//   }
// }

// // Make sure to export the login function
// module.exports = { login };
