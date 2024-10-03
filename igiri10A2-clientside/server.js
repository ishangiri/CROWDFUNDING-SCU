const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();



// Parse URL-encoded & JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Route to serve home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

//Route to server fundraisers.html
app.get("/fundraisers/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "fundraisers.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/donation", (req, res) => {
  res.sendFile(path.join(__dirname, "donations.html"));
});

app.listen(8080, () => {
  console.log("Running on port 8080");
});
