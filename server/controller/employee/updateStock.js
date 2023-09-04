const express = require('express');
const db = require('../../db'); // Import your database connection

const router = express.Router();

// Convert the timestamp to desired format (YYYY-MM-DD)
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get all data from the blood_stocks table
router.get('/blood-stocks', (request, response) => {
  const query = 'SELECT * FROM blood_stocks';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      response.status(500).json({ status: 'error', message: 'Database error' });
      return;
    }

    const stockData = results.map(stock => ({
      ...stock,
      updated_at: formatDate(stock.updated_at),
    }));

    console.log('Blood stocks fetched successfully:', stockData);
    response.status(200).json({
      status: 'success',
      results: stockData.length,
      data: stockData,
      message: 'Blood stocks fetched successfully',
    });
  });
});

// Update blood unit by ID
router.put('/blood-stocks/:id', (request, response) => {
  const { id } = request.params;
  const { unit } = request.body;

  const updateQuery = 'UPDATE blood_stocks SET unit = ? WHERE id = ?';
  db.query(updateQuery, [unit, id], (error, result) => {
    if (error) {
      console.error('Database error:', error);
      response.status(500).json({ status: 'error', message: 'Database error' });
      return;
    }

    console.log('Blood unit updated successfully:', result);
    response.status(200).json({
      status: 'success',
      message: 'Blood unit updated successfully',
    });
  });
});

module.exports = router;
