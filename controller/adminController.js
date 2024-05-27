// login
//const express = require("express");
const { log } = require("console");
const { client } = require("../config/connection");
const getLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const cl = await client.connect();
    const db = cl.db("StockManagementSystem");
    const collection = db.collection("Login");

    const emailexists = await collection.findOne({ emailId: emailId });
    console.log(emailId);
    if (emailexists) {
      const pswdexists = await collection.findOne({ password: password });

      if (pswdexists) {
        res.status(200).json({
          status: true,
          message: "Logged In Successfully ! ",
        });
      } else {
        res.status(200).json({ status: false, message: "Wrong Password !" });
      }
    } else {
      res.status(200).json({ status: false, message: "Wrong Login Id !" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = { getLogin };
