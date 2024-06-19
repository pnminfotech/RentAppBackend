// login
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const { client } = require("../config/connection");

const getLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Login");

    const user = await collection.findOne({ emailId: emailId });

    if (user) {
      const isValidPassword = await collection.findOne({
        emailId: emailId,
        password: password,
      });

      if (isValidPassword) {
        res.status(200).json({
          status: "success",
          message: "Logged In Successfully!",
        });
      } else {
        res.status(401).json({ status: "fail", message: "Wrong Password!" });
      }
    } else {
      res.status(404).json({ status: "fail", message: "User Not Found!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const getBuildings = async (req, res) => {
  try {
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Buildings");
    const totalBuildings = await collection.countDocuments();
    if (totalBuildings) {
      res.status(201).send({ totalBuildings });
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getFlats = async (req, res) => {
  try {
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Flats");
    const totalFlats = await collection.countDocuments();
    if (totalFlats) {
      res.status(201).send({ totalFlats });
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getEmptyFlats = async (req, res) => {
  try {
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Flats");
    const noOfFlatsEmpty = await collection.countDocuments({
      rental_status: "False",
    });
    if (noOfFlatsEmpty) {
      res.status(201).send({ noOfFlatsEmpty });
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getFlatsOnRent = async (req, res) => {
  try {
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Flats");
    const noOfFlatsOnRent = await collection.countDocuments({
      rental_status: "True",
    });
    if (noOfFlatsOnRent) {
      res.status(201).send({ noOfFlatsOnRent });
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getRentReceived = async (req, res) => {
  try {
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Flats");
    const noOfFlatsRentReceived = await collection.countDocuments({
      monthly_rent_recieved: "True",
    });
    if (noOfFlatsRentReceived) {
      res.status(201).send({ noOfFlatsRentReceived });
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const getRentPending = async (req, res) => {
  let cl;
  try {
    // Connect to the MongoDB client
    cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Flats");

    // Count documents where monthly_rent_recieved is "False" and rental_status is "True"
    const noOfFlatsRentPending = await collection.countDocuments({
      monthly_rent_recieved: "False",
      rental_status: "True",
    });

    // Send the count of flats with rent pending, even if it is zero
    res.status(200).send({ noOfFlatsRentPending });
  } catch (error) {
    // Log error and send a 500 status code with an error message
    console.error("Error fetching rent pending flats:", error);
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  } finally {
    // Ensure the MongoDB client is closed
    if (cl) {
      try {
        await cl.close();
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }
    }
  }
};

// const distributeItem = async (req, res) => {
//   console.log(req.body);
//   try {
//     const {
//       employeeId,
//       department,
//       firstName,
//       lastName,
//       gender,
//       joiningDate,
//       phoneNumber,
//       address,
//     } = req.body;
//     console.log(firstName);
//     const cl = await client.connect();
//     const db = cl.db("StockManagementSystem");
//     const collection = db.collection("Distribution");

//     const distribute = {
//       employeeId: employeeId,
//       department: department,
//       firstName: firstName,
//       lastName: lastName,
//       gender: gender,
//       joiningDate: joiningDate,
//       phoneNumber: phoneNumber,
//       address: address,
//     };
//     const distributed = await collection.insertOne(distribute);
//     if (distributed) {
//       console.log(req.body);
//       res.status(201).json({ message: "Item distributed" });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// };

// const getInventories = async (req, res) => {
//   try {
//     console.log("hii");
//     const cl = await client.connect();
//     const db = cl.db("StockManagementSystem");
//     const collection = db.collection("Inventories");
//     const Inventories = await collection.find().toArray();
//     if (Inventories) {
//       res.status(200).send(Inventories);
//     } else {
//       res.status(500).send("Internal Server Error");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// const addInventory = async (req, res) => {
//   console.log(req.body);
//   try {
//     const { firstName } = req.body;
//     console.log(firstName);
//     const cl = await client.connect();
//     const db = cl.db("StockManagementSystem");
//     const collection = db.collection("Inventories");

//     const inventory = {
//       firstName: firstName,
//     };
//     const addinventoryquery = await collection.insertOne(inventory);
//     if (addinventoryquery) {
//       console.log(req.body);
//       res.status(201).json({ message: "Inventory Added" });
//     } else {
//       res.status(500).json({ error: "Internal server error" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// };

// const deleteInventory = async (req, res) => {
//   try {
//     const id = req.params.id;
//     console.log(id);

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid ID format");
//     }

//     const cl = await client.connect();
//     const db = cl.db("StockManagementSystem");
//     const collection = db.collection("Inventories");

//     const result = await collection.deleteOne({ _id: new ObjectId(id) });
//     console.log(result);

//     if (result.deletedCount === 0) {
//       return res.status(404).send("Id Not Found in Database");
//     }

//     res.status(200).send({ message: "Inventory deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

const requestPasswordReset = async (req, res) => {
  try {
    const { emailId } = req.body;

    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Login");

    const user = await collection.findOne({ emailId: emailId });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User Not Found!" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    const tokenExpiration = Date.now() + 3600000; // 1 hour from now

    await collection.updateOne(
      { emailId: emailId },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: tokenExpiration,
        },
      }
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "akshatabhimnale99@gmail.com",
        pass: "agku vsci qcat pkxp",
      },
    });
    const resetLink = `exp://192.168.0.71:8081/reset-password/${token}`;
    const mailOptions = {
      to: emailId,
      from: process.env.EMAIL,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetLink}
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Error sending email. Error :" + err,
        });
      }
      res
        .status(200)
        .json({ status: "success", message: "Password reset link sent!" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Login");

    const user = await collection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Password reset token is invalid or has expired.",
      });
    }

    await collection.updateOne(
      { _id: user._id },
      {
        $set: { password: newPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      }
    );

    res
      .status(200)
      .json({ status: "success", message: "Password has been updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

module.exports = {
  getLogin,
  // distributeItem,
  // getInventories,
  // addInventory,
  // deleteInventory,
  requestPasswordReset,
  resetPassword,
  getBuildings,
  getFlats,
  getFlatsOnRent,
  getEmptyFlats,
  getRentReceived,
  getRentPending,
};
