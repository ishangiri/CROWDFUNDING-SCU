import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse URL-encoded & JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/home.html"));
});

// Add more routes here
app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "src/search.html"));
});

app.listen(8080, () => {
  console.log("Running on port 8080");
});
