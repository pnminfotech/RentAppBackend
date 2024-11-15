
// // middleware/switchDatabase.js
// const mongoose = require("mongoose");

// const switchDatabase = async (req, res, next) => {
//   const { username } = req.body;
//   if (!username) {
//     return res.status(400).json({ message: "Username is required" });
//   }

//   try {
//     // Use your MongoDB Atlas connection string here
//     `mongodb+srv://pnminfotech2024:hxkTifGMN732PLKi@rentapp.rnfrr.mongodb.net/${username}?retryWrites=true&w=majority&appName=RentApp`

//     // Replace <PASSWORD> with your actual password
//     const connection = mongoose.createConnection(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Attach the user-specific connection to the request object
//     req.userDatabase = connection;
//     next();
//   } catch (error) {
//     console.error("Error connecting to the user-specific database:", error);
//     res.status(500).json({ message: "Database connection error" });
//   }
// };

// module.exports = switchDatabase;
