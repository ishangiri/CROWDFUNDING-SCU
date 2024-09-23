import express from 'express';
import connection from './crowdfunding-db.js';
import cors from "cors";

const app = express();

app.use(cors());

// GET all active fundraisers
app.get('/api/fundraisers', (req, res) => {
  //select all fundraisers where Active is true
  const query = `
    SELECT F.*, C.NAME as CATEGORY_NAME 
    FROM FUNDRAISER F 
    JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID 
    WHERE F.ACTIVE = TRUE
  `;
  connection.query(query, (error, results) => {
    if (error) throw error;
     res.json(results);
  });
});

//Get all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM CATEGORY';
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//get the fundraisers based on the search criteria
app.get('/api/fundraisers/search', (req, res) => {
  const { organizer, city, category } = req.query;

  // Base query to get all the fundraisers
  let query = `
    SELECT F.*, C.NAME as CATEGORY_NAME 
    FROM FUNDRAISER F 
    JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
  `;

  // conditions array to add conditions
  const conditions = [];

  // Add conditions with the inputted criteria from user
  if (organizer) conditions.push(`F.ORGANIZER LIKE ${organizer}`);
  if (city) conditions.push(`F.CITY LIKE ${city}`);
  if (category) conditions.push(`C.NAME LIKE ${category}`);

  // Append conditions to the query if any exist
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  // Execute query
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


//get fundraisers by id
app.get('/api/fundraisers/:id', (req, res) => {
  //get the id from url 
  const { id } = req.params;
  // get the fundraiser by id where the ? in the F.Fndraiser_ID will be replaced by id
  const query = `
    SELECT F.*, C.NAME
    FROM FUNDRAISER F
    JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
    WHERE F.FUNDRAISER_ID = ?
  `;
  //execute the query
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Fundraiser not found' });
    res.json(results[0]);
  });
});

 



const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));