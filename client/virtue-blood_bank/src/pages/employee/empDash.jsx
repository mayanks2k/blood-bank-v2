import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/emp/empDash.css';
import '../../assets/styles/emp/empLogout.css'; // Import your CSS stylesheet
import EmployeeLogout from '../../components/employee/empLogout'; // Adjust the path based on your project structure


const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleUpdateStock = () => {
    navigate('/empStock');
  };

  const handleBloodRequest = () => {
    navigate('/empBloodReq');
  };

  const handleDonateRequest = () => {
    navigate('/empDonate');
  };

  const handleDonorRecords = () => {
    navigate('/empDonorRecords'); // Navigate to the Donor Records page
  };

  return (
    <>
          
      <div className="dashboard4">
        <h2 className="header4">Welcome to the Dashboard</h2>
        <div className="button-container4">
          <button className="dashboard-button4" onClick={handleUpdateStock}>
            Update Stock
          </button>
          <button className="dashboard-button4" onClick={handleBloodRequest}>
            Blood Requests
          </button>
          <button className="dashboard-button4" onClick={handleDonateRequest}>
            Donate Requests
          </button>
          <button className="dashboard-button4" onClick={handleDonorRecords}>
            Donor Records
          </button>
        </div>
        <EmployeeLogout /> 
      </div>
    </>
  );
};

export default Dashboard;
