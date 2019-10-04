const mysql = require("mysql");
const multer = require("multer");
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
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
app = require("./app.js");
//app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "pictures/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post("/uploadimage", upload.single("image"), (req, res) => {
  var fileInfo = req.file;
  var title = req.body.title;
  console.log(req.file.path);
  console.log(req.body.id);
  mysqlConnection.query(
    "UPDATE inventory SET image = ? WHERE ID = ?",
    [req.file.path, req.body.id],

    (err, rows, fields) => {
      if (err) {
        return res.status(400);
      } else {
        return res.send(fileInfo);
      }
    }
  );
  //res.send(fileInfo);
});
router.get("/", (req, res) => {
  let { Name, Category, Price, minPrice, maxPrice } = req.query;
  console.log(Name, Category, Price);
  if (Name == undefined && Category == undefined && Price == undefined) {
    mysqlConnection.query("SELECT * FROM inventory", (err, rows, fields) => {
      if (err) {
        return res.send(err);
      } else {
        return res.send(rows);
      }
    });
    console.log(Name, Category, Price);
  } else {
    if (Name != null) {
      mysqlConnection.query(
        "SELECT * FROM inventory where NAME=?",
        [req.query.Name],
        (err, rows, fields) => {
          if (err) {
            return res.send(err);
          } else {
            return res.send(rows);
          }
        }
      );
    } else if (Price != null) {
      mysqlConnection.query(
        "SELECT * FROM inventory where Price=?",
        [Price],
        (err, rows, fields) => {
          if (err) {
            return res.send(err);
          } else {
            return res.send(rows);
          }
        }
      );
    } else if (Category != null) {
      mysqlConnection.query(
        "SELECT * FROM inventory where Category=?",
        [Category],
        (err, rows, fields) => {
          if (err) {
            return res.send(err);
          } else {
            return res.send(rows);
          }
        }
      );
    } else if (minPrice != null && maxPrice != null) {
      mysqlConnection.query(
        "SELECT * FROM inventory where Price >=? and Price<=?",
        [minPrice],
        [maxPrice],
        (err, rows, fields) => {
          if (err) {
            return res.send(err);
          } else {
            return res.send(rows);
          }
        }
      );
    }
  }
});
router.get("/:id", (req, res) => {
  const id = req;
  console.log(id);
  mysqlConnection.query(
    "SELECT * FROM inventory WHERE ID=?",
    [req.params.id],
    (err, rows, fields) => {
      if (err) {
        return res.status(400);
      } else if (rows.length > 0) {
        return res.send(rows);
      } else if (rows.length <= 0) {
        return res.send({
          error: "ERROR 1054 Unknown column ID in where clause",
          status: 1054
        });
      }
    }
  );
});
router.post("/", (req, res) => {
  let newInventory = req.body;
  let sql =
    "SET @ID = ?; SET @Name = ?; SET @Category = ?; SET @Description = ?;SET @Price = ?; \
  CALL AddorEditInventory(@ID,@Name,@Category,@Description,@Price); ";
  mysqlConnection.query(
    sql,
    [
      newInventory.ID,
      newInventory.Name,
      newInventory.Category,
      newInventory.Description,
      newInventory.Price
    ],
    (err, rows, fields) => {
      if (!err) {
        return res.send(rows);
      } else {
        return res.send(err);
      }
    }
  );
});
router.delete("/:id", (req, res) => {
  //const id = req;
  //let newUser = req.body;
  //console.log(req.params.id);
  //console.log(req.body.customer_id);
  mysqlConnection.query(
    "SELECT * from inventory where ID = ?",
    [req.params.id],
    (err, rows, field) => {
      console.log("The length is " + rows.length);
      if (rows.length > 0) {
        if (rows) {
          mysqlConnection.query(
            "DELETE FROM inventory WHERE ID=?",
            [req.params.id],
            (err, rows, fields) => {
              if (err) {
                return res.send(err);
              } else {
                return res.send({
                  status: "Deleted Successfully",
                  rows: rows
                });
              }
            }
          );
        }
      } else if (rows.length <= 0) {
        return res.send({
          error: "ERROR 1054 Unknown column ID in where clause",
          status: 1054
        });
      }
    }
  );
});
router.put("/", (req, res) => {
  let newInventory = req.body;
  mysqlConnection.query(
    "SELECT * from inventory where ID = ?",
    [req.body.ID],
    (err, rows, field) => {
      //console.log("The rows " + rows);
      if (rows.length > 0) {
        if (rows) {
          let sql =
            "SET @ID = ?; SET @Name = ?; SET @Category = ?; SET @Description = ?;SET @Price = ?; \
  CALL AddorEditInventory(@ID,@Name,@Category,@Description,@Price); ";
          mysqlConnection.query(
            sql,
            [
              newInventory.ID,
              newInventory.Name,
              newInventory.Category,
              newInventory.Description,
              newInventory.Price
            ],
            (err, rows, fields) => {
              if (!err) {
                // console.log(rows.fields);
                return res.send({
                  status: "Updated Successfully",
                  rows: rows
                });
              } else {
                return res.send(err);
              }
            }
          );
        }
      } else if (rows.length <= 0) {
        // console.log(rows.fields);
        return res.send({
          error: "ERROR 1054 Unknown column ID in where clause",
          status: 1054
        });
      }
    }
  );
});

module.exports = router;
