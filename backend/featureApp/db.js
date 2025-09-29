const mysql = require("mysql2/promise");

const conn = mysql.createPool({
  host: "server.rwebservice.in",
  user: "face_attadance",
  password: "face_attadance",
  database: "face_attadance"
});

module.exports = conn;
