require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("flash");

const connectDB = require("./db/connect");
const taskRouter = require("./routes/tasks");
const setMessage = require("./middleware/message");

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use("/tasks", taskRouter);

// use res.render to load up an ejs view file

// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

// about page
app.get("/about", function (req, res) {
  res.render("pages/about");
});

const port = 8080;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
