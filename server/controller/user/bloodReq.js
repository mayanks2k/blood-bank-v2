const express = require('express');
const db = require('../../db'); // Import your database connection

const router = express.Router();

// Create a blood request
router.post('/blood-request', (request, response) => {
  const { user_id, blood_group, unit } = request.body;

  console.log('Received blood request:', user_id, blood_group, unit);

  // Check if the user's profile is complete
  const checkProfileQuery = 'SELECT * FROM user_details WHERE id = ? AND firstName IS NOT NULL AND lastName IS NOT NULL AND gender IS NOT NULL AND bloodGroup IS NOT NULL AND place IS NOT NULL AND email IS NOT NULL AND mobile IS NOT NULL';
  db.query(checkProfileQuery, [user_id], (profileError, profileResult) => {
    if (profileError) {
      console.log('Profile check error:', profileError);
      response.status(500).json({ status: 'error', message: 'Database error' });
      return;
    }

    if (profileResult.length === 0) {
      console.log('Profile incomplete for user:', user_id);
      response.status(400).json({ status: 'error', message: 'Please complete your profile before creating a blood request' });
      return;
    }

    // Check if user has already made a request for the same blood group
    const checkExistingRequest = 'SELECT * FROM user_request WHERE user_id = ? AND blood_group = ?';
    db.query(checkExistingRequest, [user_id, blood_group], (existingRequestError, existingRequestResult) => {
      if (existingRequestError) {
        console.log('Existing request check error:', existingRequestError);
        response.status(500).json({ status: 'error', message: 'Database error' });
        return;
      }

      if (existingRequestResult.length > 0) {
        console.log('User has already requested blood for this group:', user_id, blood_group);
        response.status(400).json({ status: 'error', message: 'You have already requested blood for this group' });
        return;
      }

      const selectQuery = 'SELECT unit FROM blood_stocks WHERE blood_group = ?';
      db.query(selectQuery, [blood_group], (selectError, selectResult) => {
        if (selectError) {
          console.log('Stocks select error:', selectError);
          response.status(500).json({ status: 'error', message: 'Database error' });
          return;
        }

        if (selectResult.length === 0) {
          console.log('Blood group not found in stocks:', blood_group);
          response.status(400).json({ status: 'error', message: 'Blood group not found' });
          return;
        }

        const availableUnits = selectResult[0].unit;

        if (unit <= availableUnits && unit <= 10) {
          const insertQuery = 'INSERT INTO user_request (user_id, blood_group, unit) VALUES (?, ?, ?)';
          db.query(insertQuery, [user_id, blood_group, unit], (insertError, insertResult) => {
            if (insertError) {
              console.log('Insert error:', insertError);
              response.status(500).json({ status: 'error', message: 'Database error' });
            } else {
              console.log('Blood request created successfully:', user_id, blood_group, unit);
              response.status(201).json({ status: 'success', message: 'Blood request created successfully' });
            }
          });
        } else {
          console.log('Invalid unit count or insufficient stocks for:', user_id, blood_group, unit);
          response.status(400).json({ status: 'error', message: 'Sorry, you cannot request more than 10 units of blood or insufficient stocks for' });
        }
      });
    });
  });
});

module.exports = router;
