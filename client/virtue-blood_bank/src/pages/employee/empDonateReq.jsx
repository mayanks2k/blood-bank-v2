import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/emp/empBloodReq.css';

const DonateRequest = () => {
  const [originalRequests, setOriginalRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/emp',
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    getAllDonationRequests();
  }, []);

  const getAllDonationRequests = () => {
    axiosInstance.get('/donationRequestList')
      .then(response => {
        const donationRequests = response.data.data;
        setOriginalRequests(donationRequests);
        setRequests(donationRequests);
      })
      .catch(error => {
        console.log("**ERROR**", error);
        toast.error("Error fetching donation requests.");
      });
  };

  const handleSearch = () => {
    const filteredRequests = originalRequests.filter(req =>
      req.userName.toLowerCase().includes(username.toLowerCase())
    );
    setRequests(filteredRequests);
  };

  const handleReset = () => {
    setRequests(originalRequests);
    setUsername('');
  };

  const handleDenyRequest = (donationRequestId) => {
    axiosInstance
      .delete(`/denyDonationRequest/${donationRequestId}`)
      .then(response => {
        const { status, message } = response.data;
        if (status === "success") {
          console.log("Donation request denied successfully.");
          getAllDonationRequests();
          toast.success("Donation request denied successfully.");
        } else {
          console.log("Failed to deny donation request:", message);
          toast.error("Failed to deny donation request.");
        }
      })
      .catch(error => {
        console.error(error);

        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred while denying donation request.');
        }
      });
  };
  
  const handleUpdateHealth = (user_id) => {
    navigate(`/empUpdateHealth/${user_id}`);
  };

  return (
    <div className="center6">
      <div className="table6-container6">
        <h1 >Donation Requests</h1>
        <br></br>
        <div className="search6-container6">
          <input
            type="text"
            className="search6"
            placeholder="Search by Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="bbutton" onClick={handleSearch}>Search</button>
          <button className="bbutton" onClick={handleReset}>Reset</button>
        </div>
        <div className="table6-responsive6">
          {requests.length === 0 ? (
            <p>No matching donation requests found.</p>
          ) : (
            <table className="table6">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.donation_request_id}>
                    <td>{r.userName}</td>
                    <td>{r.userPhone}</td>
                    <td>{r.updatedDate}</td>
                    <td>
                      <button className="bbutton deny-button" onClick={() => handleDenyRequest(r.donation_request_id)}>Deny</button>
                      <button className="bbutton update-button" onClick={() => handleUpdateHealth(r.user_id)}>Update Health</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DonateRequest;
