import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/styles/user/bloodReq.css';
import { useNavigate } from 'react-router-dom';

const BloodRequestModal = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [units, setUnits] = useState('');
  const navigate = useNavigate();

  const handleRequestBlood = async () => {
    if (!bloodGroup || !units) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const user_id = sessionStorage.getItem('userId');
      const userToken = sessionStorage.getItem('userToken');

      if (!userToken) {
        toast.error('User token not found. Please log in.');
        return;
      }

      const response = await axios.post(
        'http://localhost:4000/user/blood-request',
        { user_id, blood_group: bloodGroup, unit: units },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        }
      );

      if (response.data.status === 'success') {
        toast.success('Blood request created successfully.');
        navigate('/userHome')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while creating the blood request.');
      }
    }
  };

  return (
    <div className="modal-container">
      <h2 className="modal-header">Request Blood</h2>
      <label className="label2">Select Blood Group:</label>
      <select
        className="select-input2"
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
      >
        <option value="">Select</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>
      <br />
      <label className="label2">Number of Units:</label>
      <input
        className="number-input2"
        type="number"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
      />
      <br />
      <div className="button-container2">
        <button className="action-button send-button" onClick={handleRequestBlood}>Send</button>
        <br />
        <button className="action-button cancel-button" onClick={() => navigate('/userHome')}>Cancel</button>
      </div>
    </div>
  );
};

export default BloodRequestModal;
