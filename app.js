const mysql = require("mysql");
const router = require("router");
const Router = router();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
router.use("/", items);
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
