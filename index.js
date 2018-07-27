"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const WaiterAvailability = require("./waiter-availability");
const pg = require("pg");
const Pool = pg.Pool;

const app = express();

let PORT = process.env.PORT || 3000;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://aviwe:aviwe@localhost:5432/waiter-availability";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

const waiterAvailability = WaiterAvailability(pool);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.post("/days", async function(req, res, next) {
  try {
    let userName = req.body.userName;
    const userType = await waiterAvailability.getUserType(userName);
    if (userType === "admin") {
      res.render("days", {});
    }
  } catch (error) {
    next(error);
  }
});

app.get("/waiters/:username", async function(req, res, next) {
  try {
    res.render("waiters", {});
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, function() {
  console.log("App starting on port", PORT);
});
