// login
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

const distributeItem = async (req, res) => {
  console.log(req.body);
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
    console.log(firstName);
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
      console.log(req.body);
      res.status(201).json({ message: "Item distributed" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getInventories = async (req, res) => {
  try {
    console.log("hii");
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Inventories");
    const Inventories = await collection.find().toArray();
    if (Inventories) {
      res.status(200).send(Inventories);
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error);
  }
};

const addInventory = async (req, res) => {
  console.log(req.body);
  try {
    const { firstName } = req.body;
    console.log(firstName);
    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Inventories");

    const inventory = {
      firstName: firstName,
    };
    const addinventoryquery = await collection.insertOne(inventory);
    if (addinventoryquery) {
      console.log(req.body);
      res.status(201).json({ message: "Inventory Added" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const deleteInventory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Inventories");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log(result);

    if (result.deletedCount === 0) {
      return res.status(404).send("Id Not Found in Database");
    }

    res.status(200).send({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getLogin,
  distributeItem,
  getInventories,
  addInventory,
  deleteInventory,
};
