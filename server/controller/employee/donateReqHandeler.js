const express = require('express');
const db = require('../../db'); // Import your database connection

const router = express.Router();

// GET request to fetch all donation requests along with user details
router.get('/donationRequestList', (req, res) => {
  // Query to select all donation requests along with user details
  const sqlSelect = `
    SELECT dr.user_id, dr.donation_request_id, CONCAT(ud.firstName, ' ', ud.lastName) AS userName, ud.mobile AS userPhone, DATE(dr.created_at) AS createdDate, DATE(dr.updated_at) AS updatedDate
    FROM user_details ud
    JOIN donation_requests dr ON ud.id = dr.user_id;
  `;
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Execute the query
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log("**ERROR**", err);
      return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }

    console.log("Donation requests fetched successfully:", result);

    if (result.length > 0) {
      // Format the response data
      const formattedResult = result.map(data => ({
        ...data,
        createdDate: formatDate(data.createdDate),
        updatedDate: formatDate(data.updatedDate),
      }));

      // If donation requests are found, construct the response data with success status and results
      const responseData = {
        status: "success",
        results: result.length,
        data: formattedResult,
      };
      console.log("Response data:", responseData);
      return res.json(responseData);
    } else {
      // If no donation requests are found, construct the response data with success status, zero results, and a message
      const responseData = {
        status: "success",
        results: 0,
        message: "No donation requests found",
        data: [],
      };
      console.log("Response data:", responseData);
      return res.json(responseData);
    }
  });
});

// PUT request to update user health details
router.put("/updateHealth", (req, res) => {
    // Get request body parameters
    const user_id = req.body.user_id;
    const vitals = req.body.vitals;
    const height = req.body.height;
    const weight = req.body.weight;
    const status = req.body.status;
  console.log(user_id);
    // Check if a health record exists for the user_id
    const checkQuery = "SELECT * FROM user_health WHERE user_id = ?";
    db.query(checkQuery, [user_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.log("** CHECK ERROR **", checkErr);
        res.status(500).json({ status: "error", message: "Error checking health record", error: checkErr.message });
      } else {
        if (checkResult.length === 0) {
          // Insert new health record
          const insertQuery = "INSERT INTO user_health (user_id, vitals, height, weight, status) VALUES (?, ?, ?, ?, ?)";
          db.query(insertQuery, [user_id, vitals, height, weight, status], (insertErr, insertResult) => {
            if (insertErr) {
              console.log("** INSERT ERROR **", insertErr);
              res.status(500).json({ status: "error", message: "Error inserting health record", error: insertErr.message });
            } else {
              // Increment donation_count for the user
              const incrementQuery = "UPDATE user_health SET donation_count = donation_count + 1 WHERE user_id = ?";
              db.query(incrementQuery, [user_id], (incrementErr, incrementResult) => {
                if (incrementErr) {
                  console.log("** INCREMENT ERROR **", incrementErr);
                } else {
                  console.log("** DONATION COUNT INCREMENTED **", incrementResult);
                }
              });
  
              // Delete record from donation_requests table
              const deleteQuery = "DELETE FROM donation_requests WHERE user_id = ?";
              db.query(deleteQuery, [user_id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                  console.log("** DELETE ERROR **", deleteErr);
                } else {
                  console.log("** RECORD DELETED FROM donation_requests TABLE **", deleteResult);
                }
              });
  
              res.status(200).json({ status: "success", message: "User health details inserted successfully" });
              console.log("** SUCCESSFUL INSERT **");
            }
          });
        } else {
          // Update existing health record
          const updateQuery = "UPDATE user_health SET vitals = ?, height = ?, weight = ?, status = ? WHERE user_id = ?";
          db.query(updateQuery, [vitals, height, weight, status, user_id], (updateErr, updateResult) => {
            if (updateErr) {
              console.log("** UPDATE ERROR **", updateErr);
              res.status(500).json({ status: "error", message: "Error updating health record", error: updateErr.message });
            } else {
              // Increment donation_count for the user
              const incrementQuery = "UPDATE user_health SET donation_count = donation_count + 1 WHERE user_id = ?";
              db.query(incrementQuery, [user_id], (incrementErr, incrementResult) => {
                if (incrementErr) {
                  console.log("** INCREMENT ERROR **", incrementErr);
                } else {
                  console.log("** DONATION COUNT INCREMENTED **", incrementResult);
                }
              });
  
              // Delete record from donation_requests table
              const deleteQuery = "DELETE FROM donation_requests WHERE user_id = ?";
              db.query(deleteQuery, [user_id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                  console.log("** DELETE ERROR **", deleteErr);
                } else {
                  console.log("** RECORD DELETED FROM donation_requests TABLE **", deleteResult);
                }
              });
  
              res.status(200).json({ status: "success", message: "User health details updated successfully" });
              console.log("** SUCCESSFUL UPDATE **");
            }
          });
        }
      }
    });
  });
  

  // DELETE request to deny a user request
router.delete('/denyDonationRequest/:donation_request_id', (req, res) => {
    // Get request parameters
    const donation_request_id = req.params.donation_request_id;
  console.log(donation_request_id)
    // Define SQL query to delete the donation request
    const sqlDeleteRequest = 'DELETE FROM donation_requests WHERE donation_request_id=?';
  
    // Delete the donation request
    db.query(sqlDeleteRequest, donation_request_id, (err, result) => {
      if (err) {
        console.log('**ERROR at denyDonationRequest**' + err);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
  
      return res.json({ status: 'success', message: 'DONATION REQUEST DENIED!' });
    });
  });

  
module.exports = router;
