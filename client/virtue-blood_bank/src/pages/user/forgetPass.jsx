import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the stylesheet for react-toastify
import '../../assets/styles/user/restPass.css'; // Import your CSS stylesheet
import handleForgotPassword from '../../services/user/forgetPass';

const ForgotPass = () => {
  
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  
  const handleForgetPasswordClick = async () => {
    await handleForgotPassword(email);
  };

  
  return (
    <div className="box">
      <div className="form">
        <h2>E-mail</h2>
        <div className="inputBox">
          <input
            type="email"
            required
            value={email}
            onChange={handleEmailChange}
          />
          <span>Enter your email</span>
          <i></i>
        </div>
        
        <input type="button" value="Submit" onClick={handleForgetPasswordClick}>
          
        </input>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPass;







 /*  const navigate = useNavigate(); */

  /* const handleForgotPasswordClick = async () => {
    await handleForgotPassword(navigate);
  }; */