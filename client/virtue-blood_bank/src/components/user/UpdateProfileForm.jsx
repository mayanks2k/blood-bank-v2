import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/user/profileUpdate.css';
import '../../assets/styles/user/profile.css';

const UpdateProfileForm = () => {
  const [updatedProfile, setUpdatedProfile] = useState({});
  const navigate = useNavigate();

  const userToken = sessionStorage.getItem('userToken');
  const userId = sessionStorage.getItem('userId');

  const handleUpdateProfile = async () => {
    // Check if any of the fields are empty
    for (const property in updatedProfile) {
      if (updatedProfile.hasOwnProperty(property) && !updatedProfile[property]) {
        toast.error('Please fill in all fields.');
        return;
      }
    }

    try {
      // If an image is selected, upload it first
      if (updatedProfile.image) {
        const formData = new FormData();
        formData.append('image', updatedProfile.image);

        const imageResponse = await axios.post(
          `http://localhost:4000/user/upload-profile-image/${userId}`,
          formData,
          {
            headers: {
              authorization: userToken,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (imageResponse.data.status === 'success') {
          toast.success('Profile image updated successfully.');
          navigate('/userHome');
        } else {
          toast.error('Failed to update profile image.');
        }
      }

      // Update the rest of the profile fields
      const profileResponse = await axios.put(
        `http://localhost:4000/user/update-profile/${userId}`,
        updatedProfile,
        {
          headers: {
            authorization: userToken,
          },
        }
      );

      if (profileResponse.data.status === 'success') {
        toast.success('Profile updated successfully.');
        // Fetch updated user profile
        navigate('/userHome');
      } else if (profileResponse.data.status === 'error') {
        toast.error(profileResponse.data.status);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while updating profile.');
      }
    }
  };

  return (
    
    <div className="update-profile-form1">
      <div className="profile-form1">
      <table className="profile-table1">
        
          <tbody><tr><td> <h2 className="profile-title1">Update Profile</h2>
</td></tr>
         
          <tr>
              <td>
                <label className="form-label1">Image :</label>
              </td>
              <td>
                <input
      type="file"
      accept="image/*"
      lassName="form-control"
      onChange={(e) => setUpdatedProfile({ ...updatedProfile, image: e.target.files[0] })}
    />
              </td>
            </tr>
            <tr>
              <td>
                <label className="form-label1">Frist Name :</label>
              </td>
              <td>
                <input
      type="text"
      placeholder="First Name"
      lassName="form-control"
      value={updatedProfile.firstName || ''}
      onChange={(e) => setUpdatedProfile({ ...updatedProfile, firstName: e.target.value })}
    />
              </td>
            </tr>
            <tr>
              <td>
                <label className="form-label1">Last Name :</label>
              </td>
              <td>
                <input
      type="text"
      placeholder="Last Name"
      lassName="form-control"
      value={updatedProfile.lastName || ''}
      onChange={(e) => setUpdatedProfile({ ...updatedProfile, lastName: e.target.value })}
    />
              </td>
            </tr>           
            <tr>
              <td>
                <label className="form-label1">Email :</label>
              </td>
              <td>
                <input
      type="email"
      placeholder="Email"
      lassName="form-control"
      value={updatedProfile.email || ''}
      onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
    />
              </td>
            </tr>
            <tr>
              <td>
                <label className="form-label1">Mobile :</label>
              </td>
              <td>
                <input
      type="tel"
      placeholder="Mobile"
      lassName="form-control"
      value={updatedProfile.mobile || ''}
      onChange={(e) => setUpdatedProfile({ ...updatedProfile, mobile: e.target.value })}
    />
              </td>
            </tr>
            <tr>
              <td>
                <label className="form-label1">Gender :</label>
              </td>
              <td>
              <div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={updatedProfile.gender === 'Male'}
                    onChange={(e) => setUpdatedProfile({ ...updatedProfile, gender: e.target.value })}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={updatedProfile.gender === 'Female'}
                    onChange={(e) => setUpdatedProfile({ ...updatedProfile, gender: e.target.value })}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={updatedProfile.gender === 'Other'}
                    onChange={(e) => setUpdatedProfile({ ...updatedProfile, gender: e.target.value })}
                  />
                  Other
                </label>

              </div>
              </td>
            </tr>
            <tr>
              <td>
                <label className="form-label1">Blood Group :</label>
              </td>
              <td>
              <select
                value={updatedProfile.bloodGroup || ''}
                onChange={(e) => setUpdatedProfile({ ...updatedProfile, bloodGroup: e.target.value })}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              </td>
            </tr>

            <tr>
              <td>
                <label className="form-label1">Place :</label>
              </td>
              <td>
              <input
      type="text"
      placeholder="Place"
      lassName="form-control"
      value={updatedProfile.place || ''}
      onChange={(e) => setUpdatedProfile({ ...updatedProfile, place: e.target.value })}
    />
              </td>
            </tr>
            <tr>
                  <td colSpan="2" className="text-center1">
                    <button className="btn btn-primary1" onClick={handleUpdateProfile}>
                      Update Profile {  }
                    </button>
                    <button className="btn btn-secondary1" onClick={() => navigate('/userHome')}>
                Cancel
              </button>
                  </td>
                </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateProfileForm;
