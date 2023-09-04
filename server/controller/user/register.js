const express = require('express');
const bcrypt = require('bcrypt'); // Import the bcrypt library
const db = require('../../db'); // Import your database connection

const router = express.Router();

router.post('/register', (request, response) => {
  const { firstName, email, password } = request.body;

  // Hash the password securely using bcrypt
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (hashError, hashedPassword) => {
    if (hashError) {
      response.status(500).json({ status: 'error', message: 'Password hashing failed' });
      return;
    }

    const profileImage = 'default_profile.jpg'; // Set a default profile image

    // Check if the email is already registered
    db.query(
      'SELECT * FROM user_details WHERE email = ?',
      [email],
      (selectError, selectResult) => {
        if (selectError) {
          response.status(500).json({ status: 'error', message: 'Database error' });
          return;
        }

        if (selectResult.length > 0) {
          response.status(400).json({ status: 'error', message: 'Email already registered' });
          return;
        }

        // Insert new user
        db.query(
          'INSERT INTO user_details(firstName, email, password, profileImage) VALUES(?, ?, ?, ?)',
          [firstName, email, hashedPassword, profileImage],
          (insertError, insertResult) => {
            if (insertError) {
              response.status(500).json({ status: 'error', message: 'Registration failed', error: insertError.message });
            } else {
              response.status(201).json({ status: 'success', message: 'User registered successfully' });
            }
          }
        );
      }
    );
  });
});

module.exports = router;
