// create an express server
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
var port = process.env.PORT;

// this is for the body parser i.e req.body
app.use(express.urlencoded({ extended: "true" }));

app.set("view engine", "hbs");

// defining the schema & modal
const devSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const Dev = mongoose.model("Dev", devSchema);

// connecting the local db
mongoose.connect("mongodb://localhost:27017/asity").then(
  () => {
    console.log("Connected to DB!");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  },
  (err) => {
    console.log("ERROR:", err.message);
  }
);

// home route
app.get("/", (req, res) => {
  res.render("index");
});

// route for the form
app.post("/", (req, res) => {
  console.log(req.body);
  const devData = new Dev({
    name: req.body.name,
    org: req.body.org,
  });
  devData
    .save()
    .then(() => {
      res.send("Wallah, Baba check your console & db collection");
    })
    .catch((err) => {
      res.send("Baba, we've some error for you", err);
    });
});

app.use("*", (req, res) => {
  res.send("Baba, you are lost");
});
