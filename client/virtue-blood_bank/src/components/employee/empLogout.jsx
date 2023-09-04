import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/styles/emp/empLogout.css'; // Import your CSS stylesheet

const EmployeeLogout = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      sessionStorage.removeItem('isEmpLoggedIn');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('token');

      toast.success('Logged out successfully.');
      navigate('/empLogin');
    }
  };

  return (
    <div className="logout-container">
      <h6>Employee Logout</h6>
      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default EmployeeLogout;
