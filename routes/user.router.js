const express = require("express");
const UserModel = require("../models/user.model");
const bcrypt=require('bcrypt')

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Some Internal error occured", error });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Some Internal error occured", error });
  }
});
//Registration and user validation code
router.post("/", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    //pass 4 things from postman
    if (!name || !email || !username || !password) {
      return res.status(403).send("All Field are Mandotry"); //403 is forbidden
    }
    let user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(403)
        .send({ message: "This Email Id is already taken by someone" });
    }
    user = await UserModel.findOne({ username });
    if (user) {
      return res
        .status(403)
        .send({ message: "This username is already taken by someone " });
    }

    const hashPassword=await bcrypt.hash(password,10)
    //hide password
    const newUser = new UserModel({ name, email, username, password:hashPassword });
    const resp = await newUser.save();
    // save the User which  created
    return res.status(201).send({ message: "User Created Successfully", resp }); //201 created
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Some Internal error occured", error }); //internal server error
  }
});
router.put("/:id", async (req, res) => {
  try {
    // const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // if (!user) {
    //   return res.status(404).send({ message: "User not found" });
    // }
    // res.status(200).send(user);
    const id = req.params.id;
    const { name, password } = req.body;
    await UserModel.findByIdAndUpdate(id, { name, password });
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Some Internal error occured", error });
  }
});
router.delete("/:id",async (req, res) => {
  try {
    const id = req.params.id;
    const resp =await UserModel.findByIdAndDelete(id);
    
    if (resp) res.status(200).send({ message: "User Deleted Successfully" });
    else res.status(404).send({ message: "User no found to delete" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Some Internal error occured", error });
  }
});
module.exports = router;
