const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "MYSQL5049.site4now.net",
  user: "a9f960_mircle5",
  password: "mircle5123",
  database: "db_a9f960_mircle5",
  port: "3306",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("DB CONNECTED");
});

module.exports = connection;
