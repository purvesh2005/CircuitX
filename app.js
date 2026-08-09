const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");

const loginRoutes = require("./routes/loginRoutes");
const registerRoutes = require("./routes/registerRoutes");
const homeRoutes = require("./routes/homeRoutes");
const sellRoutes = require("./routes/sellRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const browseRoutes = require("./routes/browseRoutes");
const rootRoutes = require("./routes/rootRoutes");

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/home", homeRoutes);
app.use("/sell", sellRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/browse", browseRoutes);
app.use("/", rootRoutes);

// Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});