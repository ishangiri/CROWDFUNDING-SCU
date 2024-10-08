var connection = require("../crowdfunding-db");

connection.connect();

var express = require("express");

var router = express.Router();

//GEt all fundrasiers
router.get("/api/all/fundraisers", (req, res) => {
  const query = `
    SELECT F.*, C.NAME as CATEGORY_NAME 
    FROM FUNDRAISER F 
    JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID 
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// GET all active fundraisers
router.get("/api/fundraisers", (req, res) => {
  const query = `
    SELECT F.*, C.NAME as CATEGORY_NAME 
    FROM FUNDRAISER F 
    JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID 
    WHERE F.ACTIVE = TRUE
  `;
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

//Get all categories
router.get("/api/categories", (req, res) => {
  const query = "SELECT * FROM CATEGORY";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//get fundraisers based on search criteria
router.get("/api/fundraisers/search", (req, res) => {
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

  //routerend the conditions and params array based on the query from the user.
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

  // routerend conditions to the query if any exist
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // Execute query with parameters and check for errors if any
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error("SQL Error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//get fundraisers by id
router.get("/api/fundraisers/:id", (req, res) => {
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
    if (results.length === 0)
      return res.status(404).json({ error: "Fundraiser not found" });
    res.json(results[0]);
  });
});

//Delete Fundraiser
router.delete("/api/fundraisers/:id", (req, res) => {
  const { id } = req.params;

  const query = `  DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ err: err.message });
    return res.json({ message: "Fundraiser deleted  successfully" });
  });
});

//Update Fundraiser
router.patch("/api/fundraisers/:id", (req, res) => {
  const { id } = req.params;
  const { organizer, caption, target_funding, city, active, category_id } =
    req.body;

  // Fetch current fundraiser data
  const fetchQuery = "SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?";
  connection.query(fetchQuery, [id], (fetchErr, fetchResults) => {
    if (fetchErr) return res.status(500).json({ error: fetchErr.message });
    if (fetchResults.length === 0)
      return res.status(404).json({ error: "Fundraiser not found" });

    const currentFundraiser = fetchResults[0];

    // Use current values if new values are not provided
    const updatedOrganizer =
      organizer !== undefined ? organizer : currentFundraiser.ORGANIZER;
    const updatedCaption =
      caption !== undefined ? caption : currentFundraiser.CAPTION;
    const updatedTargetFunding =
      target_funding !== undefined
        ? target_funding
        : currentFundraiser.TARGET_FUNDING;
    const updatedCity = city !== undefined ? city : currentFundraiser.CITY;
    const updatedActive =
      active !== undefined ? active : currentFundraiser.ACTIVE;
    const updatedCategoryId =
      category_id !== undefined ? category_id : currentFundraiser.CATEGORY_ID;

    const params = [
      updatedOrganizer,
      updatedCaption,
      updatedTargetFunding,
      updatedCity,
      updatedCategoryId,
      updatedActive,
      id,
    ];

    const updateQuery = `
        UPDATE FUNDRAISER
        SET ORGANIZER = ?, CAPTION = ?, TARGET_FUNDING = ?, CITY = ?, CATEGORY_ID = ?, ACTIVE = ?
        WHERE FUNDRAISER_ID = ?
      `;

    console.log(connection.format(updateQuery, params)); // Log the query for debugging

    connection.query(updateQuery, params, (updateErr, updateResults) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });

      //check if any rows are affected
      if (updateResults.affectedRows === 0) {
        return res
          .status(404)
          .json({
            message: "No fundraiser updated, perhaps it does not exist",
          });
      }

      res.json({ message: "Fundraiser updated successfully" });
    });
  });
});

// //Donate Fundraiser
// router.post('/api/fundraisers/donate/:id', (req, res) => {
//   const { id } = req.params;
//   const { giver, amount } = req.body;
//   const query = `
//     INSERT INTO DONATION (GIVER, FUNDRAISER_ID, AMOUNT)
//     VALUES (?, ?, ?)
//   `;

//   connection.query(query, [giver, id, amount], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: 'Donation successful' });
//   });
// });

// Donate to Fundraiser and update CURRENT_FUNDING
router.post("/api/fundraisers/donate/:id", (req, res) => {
  const { id } = req.params;
  const { giver, amount } = req.body;

  // Insert donation query
  const insertDonationQuery = `
    INSERT INTO DONATION (GIVER, FUNDRAISER_ID, AMOUNT) 
    VALUES (?, ?, ?)
  `;

  // Update CURRENT_FUNDING query
  const updateFundraiserQuery = `
    UPDATE FUNDRAISER 
    SET CURRENT_FUNDING = CURRENT_FUNDING + ? 
    WHERE FUNDRAISER_ID = ?
  `;

  connection.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction failed" });

    // Step 1: Insert donation
    connection.query(
      insertDonationQuery,
      [giver, id, amount],
      (err, results) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Step 2: Update CURRENT_FUNDING for the fundraiser
        connection.query(
          updateFundraiserQuery,
          [amount, id],
          (err, results) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            // Commit the transaction if both queries succeeded
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ error: "Transaction commit failed" });
                });
              }
              res.json({
                message: "Donation successful and fundraiser updated",
              });
            });
          }
        );
      }
    );
  });
});

//Post Fundraiser
router.post("/api/fundraisers", (req, res) => {
  const { organizer, caption, target_funding, city, category_id, active } =
    req.body;
  const query = `
      INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_FUNDING, CITY, CATEGORY_ID, ACTIVE) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  const params = [
    organizer,
    caption,
    target_funding,
    city,
    category_id,
    active,
  ];

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Fundraiser created successfully",
      fundraiserId: results.insertId,
    });
  });
});

//get all donations
router.get("/api/donations", (req, res) => {
  const query = `
    SELECT * FROM DONATION
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//get the donations of one particular fundraiser

router.get("/api/donations/:id", (req, res) => {
  const { id } = req.params;
  const query = `
        SELECT * FROM DONATION WHERE FUNDRAISER_ID = ?
    `;
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
