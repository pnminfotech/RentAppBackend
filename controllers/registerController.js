// // controllers/registerController.js
// const mongoose = require("mongoose");
// const User = require('../models/User');
// const bcrypt = require("bcryptjs");

// const registerController = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         const newUser = new User({ username, email, password });
//         await newUser.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
// module.exports = { registerController };
