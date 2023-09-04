import React from 'react';
import { Link } from 'react-router-dom'; 
import '../../assets/styles/user/profile.css';
import '../../assets/styles/user/profileUpdate.css';


const UserProfileDisplay = ({ userProfile, openModal }) => {
  return (
    <div className="user-profile-card">
      <div className="user-profile-image">
        <img src={`http://localhost:4000/${userProfile.profileImage}`} alt="Profile" />
      </div>
      <div className="user-profile-details">
        <h1>{userProfile.firstName}</h1>
        <p>Blood Group: {userProfile.bloodGroup}</p>
        <p>Place: {userProfile.place}</p>
        <p>Email: {userProfile.email}</p>
        <p>Mobile: {userProfile.mobile}</p>
        <p>Donation Count: {userProfile.donation_count}</p>
        <p>Last Donation Date: {userProfile.lastDonationDate}</p>
      </div>
      <Link to="/userProfileUpdate">
        <input type="button" value="Edit" />
      </Link>
    </div>
  );
};

export default UserProfileDisplay;
