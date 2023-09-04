import React, { useState } from 'react';
import '../../assets/styles/user/userHome.css'; // Import your CSS stylesheet
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faComments, faCog, faQuestionCircle, faLock, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ReqDonate from '../../components/user/bloodReqDonateMain';
import UserProfile from '../../components/user/profile'; // Import your UserProfile component
import { useNavigate } from 'react-router-dom';


  

const UserHome = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [activeListItem, setActiveListItem] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMenu = () => {
    setMenuActive(prevMenuActive => !prevMenuActive);
  };

  const handleListItemClick = index => {
    setActiveListItem(index);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Clear user data from session storage
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('firstName');
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('isUserLoggedIn');
  
      // Notify user and navigate to login page
      // You can use a toast library for notifications
      navigate('/');
    }
  };
 
  return (
    <div>
      console.log("activeListItem:", activeListItem);
   {activeListItem === 0 && <ReqDonate/>}
    <div className="displayUserHome">
      
      <div className={`navigation ${menuActive ? 'active' : ''}`}>
        <ul>
          <li className={`list ${activeListItem === 0 ? 'active' : ''}`} onClick={() => handleListItemClick(0)}>
            <b></b>
            <b></b>
            <a href="#">
              <span className="iconUserHome">
                <FontAwesomeIcon icon={faHome} />
              </span>
              <span className="titleUserHome">Home</span>
            </a>
          </li>
          <li className={`list ${activeListItem === 1 ? 'active' : ''}`} onClick={() => handleListItemClick(1)}>
            <b></b>
            <b></b>
            <a href="#">
              <span className="iconUserHome">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span className="titleUserHome">Profile</span>
            </a>
          </li>
  
          <li className={`list ${activeListItem === 3 ? 'active' : ''}`} onClick={() => handleLogout(3)}>
            <b></b>
            <b></b>
            <a href="#">
              <span className="iconUserHome">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </span>
              <span className="titleUserHome">Sign Out</span>
            </a>
          </li>
        </ul>
      </div>
      <div className={`toggle ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuActive ? faCog : faSignOutAlt} className={`open ${menuActive ? 'hidden' : ''}`} />
        <FontAwesomeIcon icon={menuActive ? faSignOutAlt : faCog} className={`close ${!menuActive ? 'hidden' : ''}`} />
      </div>
    </div>
    {activeListItem === 1 && <UserProfile />}    
    </div>
  );
};

export default UserHome;
