import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/emp/empDonnerRecords.css';
import { ToastContainer, toast } from 'react-toastify';


const DonorRecords = () => {
  const [donorRecords, setDonorRecords] = useState([]);
  const token = sessionStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/emp', // Base URL for your APIs
    headers: {
      authorization: `Bearer ${token}`, // Attach the token to the request header
    },
  });

  useEffect(() => {
    getDonorRecords();
  }, []);

  const getDonorRecords = () => {
    axiosInstance
      .get('/donorRecords')
      .then((response) => {
        const { status, results, data, message } = response.data;
        if (status === 'success') {
          console.log('Donor records fetched successfully:', data);
          setDonorRecords(data);
        } else {
          console.log('Failed to fetch donor records:', message);
          toast.error(message || 'Failed to fetch donor records.');
        }
      })
      .catch((error) => {
        console.log('**ERROR**', error);
        toast.error('Error fetching donor records.');
      });
  };

  return (
    <div className='donorCounter'>
      <h1 className='heading'>Donor Records</h1>
      <div className='donor-records'>
        {donorRecords.length === 0 ? (
          <p>No donor records found.</p>
        ) : (
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Last Donation Date</th>
                <th>Donation Count</th>
                <th>Place</th>
              </tr>
            </thead>
            <tbody>
              {donorRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.userName}</td>
                  <td>{record.userPhone}</td>
                  <td>{record.lastDonationDate}</td>
                  <td>{record.donation_count}</td>
                  <td>{record.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DonorRecords;
