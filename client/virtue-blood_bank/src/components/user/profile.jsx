import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/styles/user/profile.css';
import '../../assets/styles/user/profileUpdate.css';

import UserProfileDisplay from './UserProfileDisplay';


const UserProfile = () => {

  const [userProfile, setUserProfile] = useState(null);

  const userToken = sessionStorage.getItem('userToken');
  const userId = sessionStorage.getItem('userId');
 
  console.log("Token"+userToken)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/user/userProfile/${userId}`, {
          headers: {
            authorization: userToken,
          },
        });
        if (response.data.status === 'success') {
          setUserProfile(response.data.user);
        } else {
          toast.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while fetching user profile.');
      }
    };

    fetchUserProfile();
  }, [userId, userToken]);





   
  return (<div>
    <div className="user-profile-box">
      <div className="user-profile-form">
        <div className="user-profile-container">
          {userProfile ? (
                     <UserProfileDisplay userProfile={userProfile} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>



      
    
    </div>
  );
};

export default UserProfile;
