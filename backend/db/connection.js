require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
        return;
    }

    console.log("MySQL connected!");

    db.query("CREATE DATABASE IF NOT EXISTS circuitx", (err) => {
        if (err) {
            console.log("Database creation error:", err);
            return;
        }

        console.log("Database ready!");
    });
});

module.exports = db;