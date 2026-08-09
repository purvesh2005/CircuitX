const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Purvesh123*',
  database: 'circuitx',
});

db.connect();

db.connect((err) => {
    if (err) throw err;

    db.query("CREATE DATABASE IF NOT EXISTS circuitx", (err) => {
        if (err) throw err;

        console.log("Database ready!");
    });
});

module.exports = db;