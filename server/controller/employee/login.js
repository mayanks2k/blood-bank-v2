const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt library
const jwt = require('jsonwebtoken'); // Import the jwt library
const db = require('../../db'); // Import your database connection
const config = require('../../config'); // Your configuration file

const router = express.Router();

router.post('/login', (request, response) => {
  const { email, password } = request.body;

  console.log('Received login request:', { email, password });

  const statement = 'SELECT * FROM emp_details WHERE email=?';
  db.query(statement, [email], (error, employees) => {
    if (error) {
      console.error('Database error:', error);
      response.status(500).json({ status: 'error', message: 'Database error' });
      return;
    }

    if (employees.length === 0) {
      console.log('Employee does not exist for email:', email);
      response.status(400).json({ status: 'error', message: 'Employee does not exist' });
      return;
    }

    const employee = employees[0];

    // Compare the provided password with the hashed password from the database
    bcrypt.compare(password, employee.password, (compareError, passwordMatch) => {
      if (compareError) {
        console.error('Password comparison error:', compareError);
        response.status(500).json({ status: 'error', message: 'Password comparison error' });
        return;
      }

      if (!passwordMatch) {
        console.log('Incorrect password for employee:', employee.id);
        response.status(400).json({ status: 'error', message: 'Incorrect password' });
        return;
      }

      // Create a payload
      const payload = {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
      };

      // Create a token
      const token = jwt.sign(payload, config.secret);

      console.log('Successful login for employee:', employee.id);
      response.status(200).json({
        status: 'success',
        data: {
          name: `${employee.firstName} ${employee.lastName}`,
          mobile: employee.mobile,
          token: token,
        },
      });
    });
  });
});

module.exports = router;
