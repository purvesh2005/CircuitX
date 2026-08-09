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

//root route
app.get("/",(req,res)=>{
    res.send("root");
});

//home route
app.get("/home",(req,res)=>{
    res.render("listings/homePage.ejs",{activePage: "home"});
});

//browse route
app.get("/browse",(req,res)=>{
    res.render("listings/browseComponents.ejs",{activePage: "browse"});
});

//dashboard route
app.get("/dashboard",(req,res)=>{
    res.render("listings/dashboard.ejs",{activePage: "dashboard"});
});

// wishlist route
app.get("/wishlist",(req,res)=>{
    res.render("listings/wishlist.ejs",{activePage: "wishlist"});
});

//sell route
app.get("/sell",(req,res)=>{
    res.render("listings/addNewComponent.ejs",{activePage: ""});
});

//user registration route
app.get("/register",(req,res)=>{
    res.render("listings/registerPage.ejs");
});

//user creating account for first time and listing in database
app.post("/register", (req, res) => {
    const { username, email, password, college } = req.body;

    // 1. Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], (err, results) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.render("listings/registerPage.ejs", {
                error: "something went wrong"
            });
        }

        // 2. User already exists
        if (results.length > 0) {
           return res.render("listings/loginPage.ejs", {
                error: "User already exists"
            });
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
                    return res.render("listings/registerPage.ejs", {
                error: err
            });
                }

                console.log("User created:", result.insertId);

                res.render("listings/loginPage.ejs");
            }
        );
    });
});

//login route
app.get("/login",(req,res)=>{
    res.render("listings/loginPage.ejs");
});

/*user is loging in here if user existed then redirect to home page 
else redirect to registration page*/
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database error");
        }

        // User not registered
        if (result.length === 0) {
            return res.render("listings/loginPage.ejs", {
                error: "User is not registered"
            });
        }

        const user = result[0];

        // Wrong password
        if (user.password !== password) {
            return res.render("listings/loginPage.ejs", {
                error: "Wrong password"
            });
        }

        // Login successful
        res.redirect("/home");
    });
});


//server is listening at port 8080
app.listen(8080,()=>{
    console.log("server is listening");
});