

var express = require('express');

var bodyParser = require('body-parser');

var app = express();
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var API = require("./controllerAPI/api_controller");
app.use("/", API);
app.listen(3080);
console.log("Server up and running on port 3080");
