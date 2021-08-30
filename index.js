const axios = require("axios");
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "terminal",
});

const getAllData = () => {
  console.log("con", con);
  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM git", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
};

exports.getAllData = getAllData;
