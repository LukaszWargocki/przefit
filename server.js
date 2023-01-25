// dependencies
// external
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require("morgan");
const flash = require("express-flash");

// internal
const connectDB = require("./config/database");
// const mainRoutes = ;
// const recipeRoutes = ;
// const commentRountes = ;

// setup .env path
require("dotenv").config({ path: "./config/.env" });

// config passport
require("./config/passport")(passport);

// connect to database
connectDB();

//