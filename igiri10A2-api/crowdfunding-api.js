import express from 'express';
import connection from './crowdfunding-db.js';
import cors from "cors";
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

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

//get fundraisers based on search criteria
app.get('/api/fundraisers/search', (req, res) => {
  const { organizer, city, category } = req.query;

  // Base query to get all fundraisers
  let query = `
    SELECT F.*, C.NAME as CATEGORY_NAME 
    FROM FUNDRAISER F 
    JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
  `;

  // Array to store query conditions and parameters
  const conditions = [];
  const params = [];

  //append the conditions and params array based on the query from the user.
  if (organizer) {
    conditions.push(`F.ORGANIZER LIKE ?`);
    params.push(`%${organizer}%`); 
  }
  if (city) {
    conditions.push(`F.CITY LIKE ?`);
    params.push(`%${city}%`);
  }
  if (category) {
    conditions.push(`F.CATEGORY_ID = ?`);
    params.push(category);  
  }

  // Append conditions to the query if any exist
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  // Execute query with parameters and check for errors if any
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('SQL Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});



//get fundraisers by id
app.get('/api/fundraisers/:id', (req, res) => {
  //get the id from url 
  const { id } = req.params;
  // get the fundraiser by id where the ? in the F.Fundraiser_ID will be replaced by id
  const query = `
    SELECT F.*, C.NAME as CATEGORY_NAME
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

 
//Delete Fundraiser
app.delete('/api/fundraisers/:id', (req,res) => {

  const {id} = req.params;

  const query = `  DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?`

  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({error : err.message});
    if(results.affectedRows === 0) return res.status(404).json({err : err.message});
    return res.json({message : "Fundraiser deleted  successfully"});
  })



})


//Update Fundraiser
app.patch('/api/fundraisers/:id', (req, res) => {
  const { id } = req.params;
  const { organizer, caption, target_funding, city, active, category_id } = req.body;

  // Fetch current fundraiser data
  const fetchQuery = 'SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';
  connection.query(fetchQuery, [id], (fetchErr, fetchResults) => {
    if (fetchErr) return res.status(500).json({ error: fetchErr.message });
    if (fetchResults.length === 0) return res.status(404).json({ error: 'Fundraiser not found' });

    const currentFundraiser = fetchResults[0];

    // Use current values if new values are not provided
    const updatedOrganizer = organizer !== undefined ? organizer : currentFundraiser.ORGANIZER;
    const updatedCaption = caption !== undefined ? caption : currentFundraiser.CAPTION;
    const updatedTargetFunding = target_funding !== undefined ? target_funding : currentFundraiser.TARGET_FUNDING;
    const updatedCity = city !== undefined ? city : currentFundraiser.CITY;
    const updatedActive = active !== undefined ? active : currentFundraiser.ACTIVE;
    const updatedCategoryId = category_id !== undefined ? category_id : currentFundraiser.CATEGORY_ID;

    const params = [updatedOrganizer, updatedCaption, updatedTargetFunding, updatedCity, updatedCategoryId, updatedActive, id];

    const updateQuery = `
      UPDATE FUNDRAISER
      SET ORGANIZER = ?, CAPTION = ?, TARGET_FUNDING = ?, CITY = ?, CATEGORY_ID = ?, ACTIVE = ?
      WHERE FUNDRAISER_ID = ?
    `;

    console.log(connection.format(updateQuery, params));  // Log the query for debugging

    connection.query(updateQuery, params, (updateErr, updateResults) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });

      //check if any rows are affected
      if (updateResults.affectedRows === 0) {
        return res.status(404).json({ message: 'No fundraiser updated, perhaps it does not exist' });
      }

      res.json({ message: 'Fundraiser updated successfully' });
    });
  });
});




//Donate Fundraiser
app.post('/api/fundraisers/donate/:id', (req, res) => {
  const { id } = req.params;
  const { giver, amount } = req.body;
  const query = `
    INSERT INTO DONATION (GIVER, FUNDRAISER_ID, AMOUNT) 
    VALUES (?, ?, ?)
  `;

  connection.query(query, [giver, id, amount], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Donation successful' });
  });
});


//Post Fundraiser
app.post('/api/fundraisers', (req, res) => {
  const { organizer, caption, target_funding, city, category_id, active } = req.body;
  const query = `
    INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_FUNDING, CITY, CATEGORY_ID, ACTIVE) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [organizer, caption, target_funding, city, category_id, active ];

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Fundraiser created successfully', fundraiserId: results.insertId });
  });
});


//get all donations
app.get('/api/donations', (req, res) => {
  const query = `
  SELECT * FROM DONATION
`;
connection.query(query, (err, results) => {
  if (err) return res.status(500).json({ error: err.message });
  res.json(results);
});
})







const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));