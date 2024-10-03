const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();


  app.use(cors());

  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const API = require("./controllerAPI/api_controller");
app.use("/", API);
app.listen(3000);
console.log("Server up and running on port 3080");
