// external dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");
const flash = require("express-flash");
const methodOverride = require("method-override");
const path = require("path");
// internal dependencies
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

// dotenv configuration path
require("dotenv").config({ path: "./config/.env" });

// config passport
require("./config/passport")(passport);

// connect to database
connectDB();

// select EJS as view generation engine
app.set("view engine", "ejs");

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// chose logging mode
app.use(logger("dev"));

// use forms for put/delete requests
app.use(methodOverride("_method"));

// setup session storage in MongoDB
app.use(
  session({
    secret: "kingpin penguin",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// use Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set up static folder with built in middleware
app.use(express.static(path.join(__dirname, 'public')));

// use flash for messaging errors, infos...
app.use(flash());

// setup routes
app.use("/", mainRoutes);
app.use("post", postRoutes);
app.use("/comment", commentRoutes);

// run the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
});
