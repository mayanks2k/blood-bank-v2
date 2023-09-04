import axios from 'axios';
import { toast } from 'react-toastify';
import { createUrl } from '../../utils/utils.js'; // Adjust the path based on your project structure

const handleSignUp = async (email, password, navigate, firstName) => {
  const url = createUrl('/user/register');

  try {
    const response = await axios.post(url, {
      email: email,
      password: password,
      firstName: firstName,
    });

    if (response.data.status === 'success') {
      toast.success('Thank you. Please Sign In.');
      navigate('/');
    } else {
      toast.error('Registration failed. Please try again.');
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred while registering.');
    }
  }
};

export default handleSignUp;
