const express = require('express');
const bcrypt = require('bcrypt'); // Import the bcrypt library
const db = require('../../db'); // Import your database connection
const utils = require('../../utils'); // Your utility functions

const router = express.Router();

router.post('/register', (request, response) => {
  const { firstName, lastName, email, mobile, password } = request.body;

  // Hash the password securely using bcrypt
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (hashError, hashedPassword) => {
    if (hashError) {
      response.status(500).json({ status: 'error', message: 'Password hashing failed' });
      return;
    }

    // Check if the email is already registered
    db.query(
      'SELECT * FROM emp_details WHERE email = ?',
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

        // Insert new employee
        db.query(
          'INSERT INTO emp_details(firstName, lastName, email, password, mobile) VALUES(?, ?, ?, ?, ?)',
          [firstName, lastName, email, hashedPassword, mobile],
          (insertError, insertResult) => {
            if (insertError) {
              response.status(500).json({ status: 'error', message: 'Registration failed', error: insertError.message });
            } else {
              response.status(201).json({ status: 'success', message: 'Employee registered successfully' });
            }
          }
        );
      }
    );
  });
});

module.exports = router;
