const { authenticateRole } = require("./middlewares");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DB_URI);

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      role: req.body.role,
    });
    res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return { status: "error", error: "Invalid login" };
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_PRIVATE_KEY
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/quote", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/phoneNumber", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });

    return res.json({ status: "ok", phoneNumber: user.phoneNumber });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/phoneNumber", async (req, res) => {
  const token = req.headers["x-acces-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      { $set: { phoneNumber: req.body.phoneNumber } }
    );

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.get("/api/admin", async (req, res) => {
  const token = req.headers["admin-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    console.log("role: " + user.role);
    if (user.role === "admin") {
      console.log("is admin");
      return res.json({ status: "ok", authorized: "true" });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Unauthorized" });
  }
  h;
});

app.get("/api/admin/getUsers", async (req, res) => {
  const token = req.headers["admin-access-token"];
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    //const users = "[";
    if (user.role === "admin") {
      console.log("before querry");
      const users = await User.find(
        {},
        { _id: 0, password: 0, __v: 0, quote: 0, phoneNumber: 0 }
      );
      console.log("after querry " + users);
      return res.json({ status: "ok", users: users });
    }
  } catch (error) {
    return res.json({ status: "error", error: "Unauthorized" });
  }
});
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
