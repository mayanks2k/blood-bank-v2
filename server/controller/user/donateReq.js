const express = require('express');
const db = require('../../db'); // Import your database connection

const router = express.Router();

// POST request to insert a donation request
router.post('/donate', (req, res) => {
  const { user_id } = req.body;

  console.log('Checking user profile completeness...');
  const checkProfileQuery = 'SELECT * FROM user_details WHERE id = ? AND firstName IS NOT NULL AND lastName IS NOT NULL AND gender IS NOT NULL AND bloodGroup IS NOT NULL AND place IS NOT NULL AND email IS NOT NULL AND mobile IS NOT NULL';
  db.query(checkProfileQuery, [user_id], (profileError, profileResult) => {
    if (profileError) {
      console.error(profileError);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }

    if (profileResult.length === 0) {
      console.log('User profile incomplete');
      return res.status(400).json({ status: 'error', message: 'Please complete your profile before sending a donation request' });
    }

    console.log('Checking existing donation request...');
    const checkExistingRequestQuery = 'SELECT * FROM donation_requests WHERE user_id = ?';
    db.query(checkExistingRequestQuery, [user_id], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Database error' });
      }

      if (result.length > 0) {
        console.log('User already has a donation request');
        return res.status(400).json({ status: 'error', message: 'User already has a donation request' });
      }

      console.log('Checking latest health entry...');
      const checkLatestHealthEntryQuery = 'SELECT * FROM user_health WHERE user_id = ? ORDER BY updatedDate DESC LIMIT 1';
      
      db.query(checkLatestHealthEntryQuery, [user_id], (healthError, healthResult) => {
        if (healthError) {
          console.error(healthError);
          return res.status(500).json({ status: 'error', message: 'Database error' });
        }

        if (healthResult.length > 0) {
          const latestEntryTimestamp = new Date(healthResult[0].updatedDate);
          const currentTime = new Date();

          const timeDifference = (currentTime - latestEntryTimestamp) / 1000; // in seconds

          if (timeDifference < 120) {
            console.log('Latest health entry is too recent');
            return res.status(400).json({ status: 'error', message: 'Cannot place donation request, latest health entry is too recent' });
          }
        }

        console.log('Inserting donation request...');
        const insertQuery = 'INSERT INTO donation_requests (user_id) VALUES (?)';
        db.query(insertQuery, [user_id], (insertError, insertResult) => {
          if (insertError) {
            console.error(insertError);
            return res.status(500).json({ status: 'error', message: 'Failed to insert donation request' });
          }

          console.log('Donation request inserted successfully');
          return res.status(201).json({ status: 'success', message: 'Donation request inserted successfully' });
        });
      });
    });
  });
});

module.exports = router;
