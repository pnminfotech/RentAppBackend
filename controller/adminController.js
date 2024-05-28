// login
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

const distributeItem = async (req, res) => {
  try {
    const {
      employeeId,
      department,
      firstName,
      lastName,
      gender,
      joiningDate,
      phoneNumber,
      address,
    } = req.body;
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Distribution");

    const distribute = {
      employeeId: employeeId,
      department: department,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      joiningDate: joiningDate,
      phoneNumber: phoneNumber,
      address: address,
    };
    const distributed = await collection.insertOne(distribute);
    if (distributed) {
      res.status(201).json({ message: "Item distributed" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = { getLogin, distributeItem };
