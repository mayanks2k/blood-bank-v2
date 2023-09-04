const express = require('express');
const db = require('../../db'); // Import your database connection

const router = express.Router();

// GET request to fetch all user requests
router.get('/bloodRequestList', (req, res) => {
  // Query to select all user requests along with user details
  const sqlSelect = `
    SELECT ur.req_id, CONCAT(ud.firstName, ' ', ud.lastName) AS userName, ud.mobile AS userPhone, ur.blood_group, ur.unit, DATE(ur.updated_at) AS updatedDate
    FROM user_details ud
    JOIN user_request ur ON ud.id = ur.user_id;
  `;

  // Execute the query
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log("**ERROR**" + err);
      return res.status(500).json({ kstatus: "error", message: "Internal Server Error" });
    }

    console.log("User requests fetched successfully:", result);

    if (result.length > 0) {
      // Convert the timestamp to desired format (YYYY-MM-DD)
      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Format the response data
      const formattedResult = result.map(data => ({
        ...data,
        updatedDate: formatDate(data.updatedDate),
      }));

      // If user requests are found, construct the response data with success status and results
      const responseData = {
        status: "success",
        results: result.length,
        data: formattedResult,
      };
      console.log("Response data:", responseData);
      return res.json(responseData);
    } else {
      // If no user requests are found, construct the response data with success status, zero results, and a message
      const responseData = {
        status: "success",
        results: 0,
        message: "No user requests found",
        data: [],
      };
      console.log("Response data:", responseData);
      return res.json(responseData);
    }
  });
});




// DELETE request to serve a user request and update blood stock
router.delete('/serveRequest/:req_id', (req, res) => {
  // Get request parameters
  const req_id = req.params.req_id;

  // Define SQL queries
  const sqlSelectRequest = 'SELECT * FROM user_request WHERE req_id=?';
  const sqlSelectStock = 'SELECT * FROM blood_stocks WHERE blood_group=?';
  const sqlUpdateStock = 'UPDATE blood_stocks SET unit=? WHERE blood_group=?';
  const sqlDeleteRequest = 'DELETE FROM user_request WHERE req_id=?';

  // Get the request details
  db.query(sqlSelectRequest, req_id, (err, result) => {
    if (err) {
      console.log('**ERROR1**' + err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }

    result = JSON.parse(JSON.stringify(result));
    const req_blood_group = result[0].blood_group;
    const req_unit = result[0].unit;

    // Get the current stock unit for the blood group
    db.query(sqlSelectStock, [req_blood_group], (err, result) => {
      if (err) {
        console.log('**ERROR2**' + err);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }

      result = JSON.parse(JSON.stringify(result));
      const stock_unit = result[0].unit;

      if (req_unit <= stock_unit) {
        const left_unit = stock_unit - req_unit;

        // Update the stock unit
        db.query(sqlUpdateStock, [left_unit, req_blood_group], (err, result) => {
          if (err) {
            console.log('**ERROR3**' + err);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
          }

          // Delete the request
          db.query(sqlDeleteRequest, req_id, (err, result) => {
            if (err) {
              console.log('**ERROR**' + err);
              return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
            }

            return res.json({ status: 'success', message: 'REQUEST SERVED!' });
          });
        });
      } else {
        return res.json({ status: 'error', message: 'INSUFFICIENT STOCKS!' });
      }
    });
  });
});


// DELETE request to deny a user request
router.delete('/denyRequest/:req_id', (req, res) => {
  // Get request parameters
  const req_id = req.params.req_id;

  // Define SQL query to delete the request
  const sqlDeleteRequest = 'DELETE FROM user_request WHERE req_id=?';

  // Delete the request
  db.query(sqlDeleteRequest, req_id, (err, result) => {
    if (err) {
      console.log('**ERROR**' + err);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }

    return res.json({ status: 'success', message: 'REQUEST DENIED!' });
  });
});


module.exports = router;
