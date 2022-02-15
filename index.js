// create an express server
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
var port = process.env.PORT || 3000;

// this is for the body parser i.e req.body
app.use(express.urlencoded({ extended: "true" }));
app.set("view engine", "hbs");

// defining the schema & modal
const devSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: String,
  password: String,
  state: String,
});

// DB VALIDATION
// const devSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     lowercase: true,
//     minlength: [4, "Username must be at least 4 characters"],
//     maxlength: [12, "Username must be less than 12 characters"],
//   },
//   email: String,
//   password: String,
// });

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
app.get("/success", (req, res) => {
  res.render("success");
});
app.get("/error", (req, res) => {
  res.render("error");
});

// route for the form
app.post(
  "/",
  [
    check(
      "username",
      "Really, what kind of username name is this, it must be >= 3 char"
    ).isLength({
      min: 3,
    }),
    check("email", "BDW your email format is bullshit").isEmail(),
    check("password", "Password must be in 5 char bro").isLength({ min: 5 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(
      `Data you've entered - `,
      req.body,
      `, Errors on you face - `,
      errors.mapped()
    );
    const devData = new Dev({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      state: req.body.state,
    });
    devData
      .save()
      .then(() => {
        errors.mapped();
        res.render("success");
        // res.send(`Wallah, Bro check your console & db collection`);
      })
      .catch((err) => {
        res.render("error");
        // res.send(`Uff, we've some error for you - ${err.message}`);
      });
  }
);

app.use("*", (req, res) => {
  res.send(`Baba, you are lost`);
});
