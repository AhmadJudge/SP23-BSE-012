const express = require("express");
let app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/contact-us", (req, res) => {
  res.render("contact-us");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});