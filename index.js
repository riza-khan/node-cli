const axios = require("axios");
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "terminal",
});

class DB {
  constructor(con) {
    this.con = con;
  }

  getAllData() {
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query("SELECT * FROM git", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
      });
    });
  }

  createBranch(branch, jira_link, type, active) {
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query(
        `INSERT INTO git (branch, jira_link, type, active) values('${branch}', '${jira_link}', '${type}', ${
          active ? active : 0
        })`,
        function (err, result, fields) {
          if (err) throw err;
          console.table(result);
        }
      );
    });
  }
}

const db = new DB(con);

exports.db = db;
