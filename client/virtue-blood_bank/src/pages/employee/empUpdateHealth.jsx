import React, { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import '../../assets/styles/emp/empUpdateHealth.css';

const UpdateHealth = () => {
  const { user_id } = useParams();
  const [vitals, setVitals] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [status, setStatus] = useState('');

  const token = sessionStorage.getItem('token');
  
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/emp',
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!vitals || !height || !weight || !status) {
      toast.error('Please fill in all fields.');
      return;
    }

    const requestBody = {
      user_id: user_id,
      vitals: vitals,
      height: height,
      weight: weight,
      status: status
    };

    axiosInstance
      .put('/updateHealth', requestBody)
      .then(response => {
        const { status, message } = response.data;
        if (status === "success") {
          console.log("User health details updated successfully.");
          toast.success("User health details updated successfully.");
          window.history.back()
        } else {
          console.log("Failed to update user health details:", message);
          toast.error("Failed to update user health details. Please try again.");
        }
      })
      .catch(error => {
        console.error(error);

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred while updating user health details.');
        }
      });
  };

  return (
    <div className="update-health-container">
      <h1>Update User Health Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Vitals:</label>
          <input type="text" value={vitals} onChange={(e) => setVitals(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Height:</label>
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Weight:</label>
          <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>
        <div className="button-group">
          <button type="submit" className="update-button">Update Health Details</button>
          <button type="button" className="cancel-button" onClick={() => window.history.back()}>Cancel</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateHealth;
