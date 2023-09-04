const db = require('../../db'); // Import your database connection
const express = require('express');

const router = express.Router();

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// GET request to fetch user health details along with user information
router.get('/donorRecords', (req, res) => {
  // Query to select user health details and user information
  const sqlSelect = `
    SELECT ud.id, CONCAT(ud.firstName, ' ', ud.lastName) AS userName, ud.mobile AS userPhone, uh.donation_count, ud.place, uh.updatedDate AS lastDonationDate
    FROM user_details ud
    JOIN user_health uh ON ud.id = uh.user_id
    ORDER BY uh.donation_count DESC;
  `;

  // Execute the query
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log("**ERROR**", err);
      return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }

    console.log("User health details fetched successfully:", result);

    if (result.length > 0) {
      // Format the response data
      const formattedResult = result.map(data => ({
        ...data,
        lastDonationDate: formatDate(data.lastDonationDate),
      }));

      // If user health details are found, construct the response data with success status and results
      const responseData = {
        status: "success",
        results: result.length,
        data: formattedResult,
      };
      console.log("Response data:", responseData);
      return res.json(responseData);
    } else {
      // If no user health details are found, construct the response data with success status, zero results, and a message
      const responseData = {
        status: "success",
        results: 0,
        message: "No user health details found",
        data: [],
      };
      console.log("Response data:", responseData);
      return res.json(responseData);
    }
  });
});

module.exports = router;
