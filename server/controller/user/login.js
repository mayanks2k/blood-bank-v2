const express = require('express');
const bcrypt = require('bcrypt'); // Import bcrypt library
const jwt = require('jsonwebtoken'); // Import the jwt library
const db = require('../../db'); // Import your database connection
const config = require('../../config'); // Your configuration file
const transporter = require('../../nodemailerConfig'); 

const router = express.Router();

router.post('/login', (request, response) => {
  const { email, password } = request.body;
  const statement = 'SELECT * FROM user_details WHERE email=?';  
  db.query(statement, [email], (error, users) => {
    if (error) {
      console.error('Login DB Error:', error);
      response.status(500).json({ status: 'error', message: 'Database error' });
      return;
    }

    if (users.length === 0) {
      console.log('Login User Not Found:', email);
      response.status(400).json({ status: 'error', message: 'User does not exist' });
      return;
    }
    
    const user = users[0];
    console.log('User Found:', user.id);
    // Compare the provided password with the hashed password from the database
    bcrypt.compare(password, user.password, (compareError, passwordMatch) => {
      if (compareError) {
        response.status(500).json({ status: 'error', message: 'Password comparison error' });
        return;
      }

      if (!passwordMatch) {
        response.status(400).json({ status: 'error', message: 'Incorrect credentials' });
        return;
      }

      // Create a payload
      const payload = {
        id: user.id,
        name: `${user.firstName}`,
      };

      // Create a token
      const token = jwt.sign(payload, config.secret);

      response.status(200).json({
        status: 'success',
        data: {
          id: user.id, // Include the user's ID in the response
          firstName: `${user.firstName}`,
          mobile: user.mobile,
          profileImage: user.profileImage,
          token: token,
        },
      });
    });
  });
});






router.post('/forgotPassword', (request, response) => {
  const { email } = request.body;

  // Check if email exists in the database
  const statement = 'SELECT * FROM user_details WHERE email=?';
  db.query(statement, [email], (error, users) => {
    if (error) {
      response.status(500).json({ status: 'error', message: 'Database error ' });
      return;
    }

    if (users.length === 0) {
      response.status(400).json({ status: 'error', message: 'User does not exist' });
      return;
    }

    const user = users[0];
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: '1h' }); // Create JWT token

    // Insert reset token into password_reset_tokens table
    const insertTokenQuery = 'INSERT INTO user_password_reset_tokens (user_id, token) VALUES (?, ?)';
    db.query(insertTokenQuery, [user.id, token], (insertError, insertResult) => {
      if (insertError) {
        response.status(500).json({ status: 'error', message: 'Database error in token ' });
        console.error('Insertion error:', insertError);

        return;
      }

      // Send email with token and reset password link
      const resetLink = `http://localhost:3000/userResetPassword?token=${token}`;
      const mailOptions = {
        from: `Virtue Blood Bank<${config.email.user}>`,
        to: user.email,
        subject: 'Reset Your Password',
        text: `Click the link to reset your password: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (mailError, info) => {
        if (mailError) {
          console.error('Mail Sending Error:', mailError);
          response.status(500).json({ status: 'error', message: 'Failed to send email' });
          return;
        }

        response.status(200).json({ status: 'success', message: 'Password reset link sent' , token: token});
      });
    });
  });
});



// POST request to reset user password
router.post('/resetPassword', (request, response) => {
  const { token, newPassword } = request.body;
  
  // Query to validate the token and get the associated user_id
  const tokenValidationQuery = 'SELECT user_id FROM user_password_reset_tokens WHERE token = ? AND created_at >= NOW() - INTERVAL 1 HOUR';
  db.query(tokenValidationQuery, [token], (error, results) => {
    if (error) {
      console.error('Token Validation DB Error:', error);
      response.status(500).json({ status: 'error', message: 'Database error1' });
      return;
    }

    if (results.length === 0) {
      console.error('Invalid or expired token:', token);
      response.status(400).json({ status: 'error', message: 'Invalid or expired token' });
      return;
    }

    const user_id = results[0].user_id;

    // Retrieve the old hashed password from the database
    const oldPasswordQuery = 'SELECT password FROM user_details WHERE id = ?';
    db.query(oldPasswordQuery, [user_id], (oldPasswordError, oldPasswordResults) => {
      if (oldPasswordError) {
        response.status(500).json({ status: 'error', message: 'Database error4' });
        console.log(error);
        return;
      }

      const oldPasswordHash = oldPasswordResults[0].password;

      // Compare the new password (plain text) with the old hashed password
      bcrypt.compare(newPassword, oldPasswordHash, (compareError, passwordMatch) => {
        if (compareError) {
          console.error('Password Comparison Error:', compareError);
          response.status(500).json({ status: 'error', message: 'Password comparison error' });
          return;
        }

        if (passwordMatch) {
          console.error('New password is the same as the old password');
          response.status(400).json({ status: 'error', message: 'New password must be different from the old password' });
          return;
        }

        // Hash the new password and update the user's password in the database
        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, (hashError, hashedPassword) => {
          if (hashError) {
            console.error('Password Hashing Error:', hashError);
            response.status(500).json({ status: 'error', message: 'Password hashing error' });
            console.log(error);
            return;
          }

          // Update user's password in the user_details table
          const updatePasswordQuery = 'UPDATE user_details SET password = ? WHERE id = ?';
          db.query(updatePasswordQuery, [hashedPassword, user_id], (updateError, updateResult) => {
            if (updateError) {
              response.status(500).json({ status: 'error', message: 'Database error2' });
              console.log(error);
              return;
            }

            // Delete the token from user_password_reset_tokens table
            const deleteTokenQuery = 'DELETE FROM user_password_reset_tokens WHERE token = ?';
            db.query(deleteTokenQuery, [token], (deleteError, deleteResult) => {
              if (deleteError) {
                response.status(500).json({ status: 'error', message: 'Database error3' });
                console.log(error);
                return;
              }
              console.log('Password reset successful for user ID:', user_id);
              response.status(200).json({ status: 'success', message: 'Password reset successful' });
            });
          });
        });
      });
    });
  });
});


module.exports = router;
