import express from 'express';
import connection from './crowdfunding-db.js';

const app = express();

// GET all active fundraisers
app.get('/api/fundraisers', (req, res) => {
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

// ... rest of your routes ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));