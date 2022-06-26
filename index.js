const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const user = require("./routes/user");
const checklist = require("./routes/checklist");
const order = require("./routes/order");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

console.log(process.env.PORT);
// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */

app.use("/user", user);
app.use("/checklist", checklist);
app.use("/order", order);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
