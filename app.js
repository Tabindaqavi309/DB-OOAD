const mysql = require("mysql");
const items = require("./items.js");
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/manageitems", items);
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "inventory"
});
mysqlConnection.connect(err => {
  if (!err) console.log("DB connection succeeded");
  else console.log(err);
});
app.listen(3000, err => {
  if (!err) console.log("Server Is running at Local Host : 3000");
  else console.log(err);
});
app.get("/", (req, res) => {
  res.send("WELCOME TO CANTEEN ORDERING AND MANAGEMENT SYSTEM");
});
module.exports = app;
