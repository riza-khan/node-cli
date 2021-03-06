const axios = require("axios");
const mysql = require("mysql2");
const moment = require("moment");
const chalk = require("chalk");

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
      this.con.query("SELECT * FROM git", (err, result, fields) => {
        if (err) throw err;
        console.table(result);
        process.exit(0);
      });
    });
  }

  create(branch, jira_link, type, active) {
    const errors = [];
    if (!branch) errors.push("Branch is required");
    if (!jira_link) errors.push("Jira Link is required");
    if (!type) errors.push("Type of ticket is required");
    if (errors.length) {
      console.log(chalk.red(errors.join(", \n")));
      return process.exit(0);
    }
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query(
        `INSERT INTO git (branch, jira_link, type, active) values('${branch}', '${jira_link}', '${type}', ${
          active ? active : 0
        })`,
        (err, result, fields) => {
          if (err) throw err;
          console.log(chalk.bold.green("Branch Info added successfully!"));
          process.exit(0);
        }
      );
    });
  }

  toggle(branch) {
    if (!branch) {
      console.log(chalk.bold.red("Please enter a branch name"));
      return process.exit(0);
    }
    this.con.connect((err) => {
      if (err) throw err;
      this.findByBranch(branch)
        .then((result) => {
          const currentState = result[0].active === 1 ? 0 : 1;
          this.con.query(
            `UPDATE git SET active = ${currentState} WHERE branch = '${branch}'`,
            (err, result, fields) => {
              console.log(
                `${branch} is now ${
                  currentState === 1
                    ? chalk.bold.green("Active")
                    : chalk.bold.red("Deactivated")
                }`
              );
              process.exit(0);
            }
          );
        })
        .catch((e) => {
          console.log(e);
          process.exit(0);
        });
    });
  }

  time(branch) {
    if (!branch) {
      console.log(chalk.bold.red("Please enter a branch name"));
      return process.exit(0);
    }
    this.con.connect((err) => {
      if (err) throw err;
      this.findByBranch(branch, "created_at", "updated_at")
        .then((result) => {
          const start = moment(result[0].created_at);
          const end = moment(result[0].updated_at);
          var duration = moment.duration(end.diff(start));
          var hours = duration.asHours();
          console.log(chalk.bold.red(hours.toFixed(2)));
          process.exit(0);
        })
        .catch((e) => {
          console.log(e);
          process.exit(0);
        });
    });
  }

  find(branch) {
    if (!branch) {
      console.log(chalk.bold.red("Please enter a branch name"));
      return process.exit(0);
    }
    this.con.connect((err) => {
      if (err) throw err;
      this.findByBranch(branch, "jira_link", "type")
        .then((result) => {
          const jira_link = result[0].jira_link;
          const type = result[0].type;
          console.log(`Jira Link: ${jira_link} \nType: ${type}`);
          process.exit(0);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  hash(branch, githash) {
    this.con.connect((err) => {
      if (err) throw err;
      this.findByBranch(branch.split("\n").join(""), "branch")
        .then((result) => {
          const existingBranch = result[0].branch;
          this.con.query(
            `INSERT INTO hash (branch, hash) values('${existingBranch}', '${githash}')`,
            (err, result, fields) => {
              if (err) throw err;
              console.log(`Hash: ${githash} saved`);
              process.exit(0);
            }
          );
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  // Private method and more comments
  findByBranch(branch, ...columns) {
    return new Promise((resolve, reject) => {
      const targetColumns = columns.length ? columns.join(", ") : "*";
      this.con.query(
        `SELECT ${targetColumns} FROM git WHERE branch = '${branch}'`,
        (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
}

const db = new DB(con);

exports.db = db;
