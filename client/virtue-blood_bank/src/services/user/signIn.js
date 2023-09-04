import axios from 'axios';
import { toast } from 'react-toastify';
import { createUrl } from '../../utils/utils.js'; // Adjust the path based on your project structure

const handleSignIn = async (email, password, navigate) => {
  const url = createUrl('/user/login');

  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
    });

    if (response.data.status === 'success') {
      // Store user data in session storage
      const { id, firstName, token } = response.data.data;

      sessionStorage.setItem('userId', id);
      sessionStorage.setItem('firstName', firstName);
      sessionStorage.setItem('userToken', token);
      sessionStorage.setItem('isUserLoggedIn', 'true'); // Change to string value

      toast.success(`Welcome ${firstName}!`);

      navigate('/userHome');
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred while logging in.');
    }
  }
};

export default handleSignIn;
