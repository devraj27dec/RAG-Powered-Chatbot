const mysql = require("mysql2/promise");

const mySqlPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Mysql123",
  database: process.env.DB_NAME,
});


module.exports = mySqlPool;