const express = require ("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require('path');


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

app.listen(8080,()=>{
    console.log("server is listening");
});