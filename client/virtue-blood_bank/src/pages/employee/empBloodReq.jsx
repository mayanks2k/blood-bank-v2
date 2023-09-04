import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/emp/empBloodReq.css';

const BloodRequest = () => {
  const [originalRequests, setOriginalRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [username, setUsername] = useState('');

  const token = sessionStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/emp',
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    getAllReq();
  }, []);

  const getAllReq = () => {
    axiosInstance.get("/bloodRequestList")
      .then(response => {
        const breq = response.data;
        setOriginalRequests(breq.data);
        setRequests(breq.data);
      })
      .catch(error => {
        console.log("**ERROR**", error);
        toast.error("Error fetching blood requests.");
      });
  };

  const handleSearch = () => {
    const filteredRequests = originalRequests.filter(req => req.userName.toLowerCase().includes(username.toLowerCase()));
    setRequests(filteredRequests);
  };

  const handleReset = () => {
    setRequests(originalRequests);
    setUsername('');
  };

  const handleServeRequest = (req_Id) => {
    axiosInstance
      .delete(`/serveRequest/${req_Id}`)
      .then(response => {
        const { status, message } = response.data;
        if (status === "success") {
          console.log("Request served successfully.");
          getAllReq();
          toast.success("Request served successfully.");
        } else {
          console.log("Failed to serve request:", message);
          toast.error("Failed to serve request.");
        }
      })
      .catch(error => {
        console.log("**ERROR**", error);
        toast.error("Error serving request.");
      });
  };

  const handleDenyRequest = (req_Id) => {
    axiosInstance
      .delete(`/denyRequest/${req_Id}`)
      .then(response => {
        const { status, message } = response.data;
        if (status === "success") {
          console.log("Request denied successfully.");
          getAllReq();
          toast.success("Request denied successfully.");
        } else {
          console.log("Failed to deny request:", message);
          toast.error("Failed to deny request.");
        }
      })
      .catch(error => {
        console.log("**ERROR**", error);
        toast.error("Error denying request.");
      });
  };

  return (
    <div className="center6">
      <div className="table6-container6">
        <h1 className="table6-heading">Blood Requests</h1>
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
        <div className='table6-responsive6'>
          {requests.length === 0 ? (
            <p>No matching requests found.</p>
          ) : (
            <table className='table6 table6-bordered'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone No.</th>
                  <th>Date</th>
                  <th>Blood Group Requested</th>
                  <th>Units</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.req_id}>
                    <td>{r.userName}</td>
                    <td>{r.userPhone}</td>
                    <td>{r.updatedDate}</td>
                    <td>{r.blood_group}</td>
                    <td>{r.unit}</td>
                    <td>
                      <button className="bbutton" onClick={() => handleServeRequest(r.req_id)}>Served</button>
                      <button className="bbutton" onClick={() => handleDenyRequest(r.req_id)}>Deny</button>
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

export default BloodRequest;
