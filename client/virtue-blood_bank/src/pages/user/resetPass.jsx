import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/user/restPass.css';

const ResetPass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/user/resetPassword',
        { newPassword, token },
      );

      if (response.data.status === 'success') {
        toast.success('Password reset successful.');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="box">
    <div className="form">
      <h2>Reset Password</h2>
      <div className="inputBox">
        <input
          type="password"
          required
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
        <span>New Password</span>
        <i></i>
      </div>
      <div className="inputBox">
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <span>Confirm Password</span>
        <i></i>
      </div>
      <input type="button" value="Reset" onClick={handleResetPassword} />
    </div>
    <ToastContainer />
  </div>
  );
};

export default ResetPass;
