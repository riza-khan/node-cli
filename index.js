const axios = require("axios");
const mysql = require("mysql2");
const moment = require("moment");

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

  all() {
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query("SELECT * FROM git", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
        process.exit(0);
      });
    });
  }

  create(branch, jira_link, type, active) {
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query(
        `INSERT INTO git (branch, jira_link, type, active) values('${branch}', '${jira_link}', '${type}', ${
          active ? active : 0
        })`,
        function (err, result, fields) {
          if (err) throw err;
          console.table(result);
          process.exit(0);
        }
      );
    });
  }

  toggle(branch) {
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query(
        `SELECT active FROM git WHERE branch = '${branch}'`,
        (err, result, fields) => {
          const currentState = result[0].active === 1 ? 0 : 1;
          this.con.query(
            `UPDATE git SET active = ${currentState} WHERE branch = '${branch}'`,
            (err, result, fields) => {
              console.log(
                `${branch} is now ${
                  currentState === 1 ? "Active" : "Deactivated"
                }`
              );
              process.exit(0);
            }
          );
        }
      );
    });
  }

  time(branch) {
    this.con.connect((err) => {
      if (err) throw err;
      this.findByBranch(branch, "created_at", "updated_at")
        .then((result) => {
          const start = moment(result.created_at);
          const end = moment(result.updated_at);
          var duration = moment.duration(end.diff(start));
          var hours = duration.asHours();
          console.log(hours.toFixed(2));
          process.exit(0);
        })
        .catch((e) => {
          console.log(e);
          process.exit(0);
        });
    });
  }

  // Private
  findByBranch(branch, ...columns) {
    console.log(columns.join(", ").toString());
    return new Promise((resolve, reject) => {
      const targetColumns = columns.join(", ");
      this.con.query(
        `SELECT ${targetColumns} FROM git WHERE branch = '${branch}'`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result[0]);
        }
      );
    });
  }
}

const db = new DB(con);

exports.db = db;
