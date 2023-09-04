const express = require('express');
const db = require('../../db'); // Import your database connection
const multer = require('multer'); // Import multer for handling file uploads

const router = express.Router();
router.get('/userProfile/:userId', (request, response) => {
  const userId = request.params.userId;

  const profileQuery = `
  SELECT 
    ud.firstName,  
    ud.bloodGroup, 
    ud.place, 
    ud.email, 
    ud.mobile, 
    ud.profileImage, 
    uh.donation_count,
    DATE(uh.updatedDate) AS lastDonationDate 
  FROM user_details ud
  LEFT JOIN user_health uh ON ud.id = uh.id
  WHERE ud.id = ?`;

db.query(profileQuery, [userId], (error, results) => {
  if (error) {
    response.status(500).json({ status: 'error', message: 'Database error' });
  } else {
    if (results.length === 0) {
      response.status(404).json({ status: 'error', message: 'User not found' });
    } else {
      const userData = results[0];
      // Extract only the date part from lastDonationDate
      const lastDonationDate = userData.lastDonationDate ? userData.lastDonationDate.toISOString().split('T')[0] : null;
      
      // Include the extracted date in the response
      response.status(200).json({ status: 'success', user: { ...userData, lastDonationDate } });
    }
  }
});
});


// Configure multer to store uploaded images in the 'uploads' folder
const upload = multer({ dest: 'uploads' });

router.post('/upload-profile-image/:userId', upload.single('image'), (request, response) => {
  const { userId } = request.params;
  
  if (!request.file) {
    return response.status(400).json({ error: 'No file uploaded' });
  }
  
  const filename = request.file.filename;

  db.query(
    'UPDATE user_details SET profileImage = ? WHERE id = ?',
    [filename, userId],
    (error, result) => {
      if (error) {
        response.status(500).json({ status: 'error', message: 'Error updating profile image' });
      } else {
        response.status(200).json({ status: 'success', message: 'Profile image updated successfully' });
      }
    }
  );
});

//update profile  
router.put('/update-profile/:userId', (request, response) => {
  const userId = request.params.userId;
  const { firstName, lastName, email, mobile, gender, bloodGroup, place } = request.body;

  // Check if the user exists
  db.query(
    'SELECT * FROM user_details WHERE id = ?',
    [userId],
    (selectError, selectResult) => {
      if (selectError) {
        response.status(500).json({ status: 'error', message: 'Database error' });
        console.log("error db 1"+error)
        return;
      }

      if (selectResult.length === 0) {
        response.status(404).json({ status: 'error', message: 'User not found' });
        console.log("User not found"+error)
        return;
      }

      // Update user profile
      db.query(
        'UPDATE user_details SET firstName = ?, lastName = ?, gender = ?, bloodGroup = ?, place = ?, email = ?, mobile = ? WHERE id = ?',
        [firstName, lastName, gender, bloodGroup, place, email, mobile, userId],
        (updateError, updateResult) => {
          if (updateError) {
            response.status(500).json({ status: 'error', message: 'Update failed', error: updateError.message });
            console.log("Update failed"+error)
          } else {
            response.status(200).json({ status: 'success', message: 'Profile updated successfully' });
          }
        }
      );
    }
  );
});


module.exports = router;
