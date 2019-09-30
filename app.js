//const mysql = require("mysql");
const items = require("./items.js");
const express = require("express");
//const newFile = require('/newFile');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/manageitems", items);

app.listen(3000, err => {
  if (!err) console.log("Server Is running at Local Host : 3000");
  else console.log(err);
});
app.get("/", (req, res) => {
  res.send("WELCOME TO CANTEEN ORDERING AND MANAGEMENT SYSTEM");
});
//module.exports = app;
