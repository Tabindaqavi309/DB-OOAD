const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "inventory",
  multipleStatements: true
});
mysqlConnection.connect(err => {
  if (!err) console.log("DB connection succeeded");
  else console.log(err);
});
app = require("./app.js");
//user
router.post("/", (req, res) => {
  console.log("Hello World");
  let newUser = req.body;
  let sql =
    "SET @customer_id = ?; SET @customer_firstname = ?; SET @customer_lastname = ?; SET @customer_username = ?;SET @customer_email = ?;SET @customer_password = ?;SET @wallet_balance = ?; \
    CALL AddorEditUser(@customer_id,@customer_firstname,@customer_lastname,@customer_username,@customer_email,@customer_password,@wallet_balance);";
  mysqlConnection.query(
    sql,
    [
      newUser.customer_id,
      newUser.customer_firstname,
      newUser.customer_lastname,
      newUser.customer_username,
      newUser.customer_email,
      newUser.customer_password,
      newUser.wallet_balance
    ],
    (err, rows, fields) => {
      if (!err) {
        // console.log("successfully sent!");
        return res.send({
          status: "successfully Added"
        });
      } else {
        return res.send(err);
      }
    }
  );
});
//admin
router.get("/", (req, res) => {
  console.log("hello");
  mysqlConnection.query("SELECT * FROM CUSTOMER", (err, rows, fields) => {
    if (rows) {
      return res.send(rows);
    } else {
      return res.status(400);
    }
  });
});
//user
router.get("/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM CUSTOMER WHERE customer_id =?",
    [req.params.id],
    (err, rows, fields) => {
      if (rows.length > 0) {
        if (rows) return res.send(rows);
      } else if (err) {
        return res.status(400);
      } else if (rows.length <= 0) {
        return res.send({
          error: "ERROR 1054 Unknown column ID in where clause",
          status: 1054
        });
      }
    }
  );
});
//user
router.put("/", (req, res) => {
  let newUser = req.body;
  mysqlConnection.query(
    "SELECT * from customer where customer_id = ?",
    [req.body.customer_id],
    (err, rows, field) => {
      console.log("The length is " + rows.length);
      if (rows.length > 0) {
        if (rows) {
          let sql =
            "SET @customer_id = ?; SET @customer_firstname = ?; SET @customer_lastname = ?; SET @customer_username = ?;SET @customer_email = ?;SET @customer_password = ?;SET @wallet_balance = ?; \
    CALL AddorEditUser(@customer_id,@customer_firstname,@customer_lastname,@customer_username,@customer_email,@customer_password,@wallet_balance);";
          mysqlConnection.query(
            sql,
            [
              newUser.customer_id,
              newUser.customer_firstname,
              newUser.customer_lastname,
              newUser.customer_username,
              newUser.customer_email,
              newUser.customer_password,
              newUser.wallet_balance
            ],
            (err, rows, fields) => {
              if (!err) {
                // console.log("successfully sent!");
                return res.send({
                  status: "successfully Updated",
                  rows: rows
                });
              } else {
                return res.send(err);
              }
            }
          );
        }
      } else if (rows.length <= 0) {
        console.log(rows.fields);
        return res.send({
          error: "ERROR 1054 Unknown column ID in where clause",
          status: 1054
        });
      }
    }
  );
});
router.post("/login", (req, res) => {
  let username = req.body.user_name;
  let bool = username ? true : false;
  // let admin_name = req.body.admin_name;

  if (bool) {
    mysqlConnection.query(
      "SELECT * from customer where customer_username = ? AND customer_password=?",
      [req.body.user_name, req.body.user_password],
      (err, rows, field) => {
        if (!err) {
          if (rows.length > 0) {
            if (rows) {
              return res.send({
                status: "SUCCESSFULLY LOG IN",
                Profile: rows
              });
            }
          } else {
            return res.send({
              error: "Incorrect Username or Password"
            });
          }
        }
        if (err) {
          res.send(err);
        }
      }
    );
  } else {
    mysqlConnection.query(
      "SELECT * from administrator where admin_name = ? AND admin_password=?",
      [req.body.admin_name, req.body.admin_password],
      (err, rows, field) => {
        if (!err) {
          if (rows.length > 0) {
            if (rows) {
              return res.send({
                status: "SUCCESSFULLY LOG IN AS ADMIN",
                Profile: rows
              });
            }
          } else {
            return res.send({
              error: "Incorrect Username or Password"
            });
          }
        }
        if (err) {
          res.send(err);
        }
      }
    );
  }
});

module.exports = router;
