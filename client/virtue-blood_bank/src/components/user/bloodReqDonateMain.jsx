import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/styles/user/bloodReqDonateMain.css';
import { useNavigate } from 'react-router-dom';

const ReqDonate = () => {
  const navigate = useNavigate();

  const handleDonateBlood = async () => {
    try {
      const user_id = sessionStorage.getItem('userId');
      const userToken = sessionStorage.getItem('userToken');

      if (!userToken) {
        toast.error('User token not found. Please log in.');
        return;
      }

      console.log('Sending donation request...');
      const response = await axios.post(
        'http://localhost:4000/user/donate',
        { user_id },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: userToken,
          },
        }
      );

      console.log('Response:', response.data);

      if (response.data.status === 'success') {
        toast.success('Donation request sent successfully.');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while sending the donation request.');
      }
    }
  };

  return (
    
    <div className="blood-donation-container11">
      <div className="rounded-box11">
        <button className="donate-button11" onClick={handleDonateBlood}>
          Donate Blood
        </button>
        <button className="request-button11" onClick={() => navigate('/userBloodRequest')}>
          Request Blood
        </button>
      </div>
    </div>
  );
};

export default ReqDonate;
