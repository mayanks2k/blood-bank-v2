import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/styles/emp/empLogin.css';

const EmployeeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Logging in...'); // Debugging

    // Request body
    const data = {
      email: email,
      password: password
    };

    try {
      console.log('Sending login request...'); // Debugging
      const response = await axios.post('http://localhost:4000/emp/login', data);

      console.log('Login response:', response.data); // Debugging

      if (response.data.status === 'success') {
        const { name, token } = response.data.data;

        console.log('Login success. Employee:', name); // Debugging

        sessionStorage.setItem('isEmpLoggedIn', 'true');
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('token', token);

        toast.success(`Welcome ${name}!`);
        navigate('/empDash');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error); // Debugging
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred while logging in.');
      }    }
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container3">
      <div className="row justify-content-center">
        <div className="col-sm-6">
          <div className="card3 mt-5">
            <div className="card3-body">
              <h2 className="card3-title3 text-center mb-4">Employee Login</h2>
              <br />
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label3">E-mail:</label>
                  <input
                    type="text"
                    className="form-control3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label3">Password:</label>
                  <input
                    type="password"
                    className="form-control3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="text-center3">
                  <button type="submit" className="btn btn-primary3 mr-2">
                    Login
                  </button>{"  "}
                  <button type="button" className="btn btn-secondary3" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
