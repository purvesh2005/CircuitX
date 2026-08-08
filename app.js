const express = require ("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require('path');
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


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);


app.get("/",(req,res)=>{
    res.send("root");
});


app.get("/home",(req,res)=>{
    res.render("listings/homePage.ejs",{activePage: "home"});
});

app.get("/browse",(req,res)=>{
    res.render("listings/browseComponents.ejs",{activePage: "browse"});
});

app.get("/dashboard",(req,res)=>{
    res.render("listings/dashboard.ejs",{activePage: "dashboard"});
});

app.get("/wishlist",(req,res)=>{
    res.render("listings/wishlist.ejs",{activePage: "wishlist"});
});

app.get("/sell",(req,res)=>{
    res.render("listings/addNewComponent.ejs",{activePage: ""});
});

app.get("/register",(req,res)=>{
    res.render("listings/registerPage.ejs");
});

app.post("/register", (req, res) => {
    const { username, email, password, college } = req.body;

    // 1. Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, results) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.send("Something went wrong");
        }

        // 2. User already exists
        if (results.length > 0) {
            return res.send(`
                <h2>Already Registered</h2>
                <p>This email is already registered. Please login.</p>
                <a href="/login">Login</a>
            `);
        }

        // 3. User doesn't exist → create account
        const insertSql = `
            INSERT INTO users (username, email, password , collegeName)
            VALUES (?, ?, ? ,?)
        `;

        db.query(
            insertSql,
            [username, email, password , college],
            (err, result) => {

                if (err) {
                    console.log("MYSQL ERROR:", err);
                    return res.send("Registration failed");
                }

                console.log("User created:", result.insertId);

                res.send(`
                    <h2>Registration Successful!</h2>
                    <p>Your account has been created.</p>
                    <a href="/login">Login</a>
                `);
            }
        );
    });
});
app.get("/login",(req,res)=>{
    res.render("listings/loginPage.ejs");
});

app.listen(8080,()=>{
    console.log("server is listening");
});