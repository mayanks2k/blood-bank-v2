import axios from 'axios';
import { toast } from 'react-toastify';
import { createUrl, log } from '../../utils/utils.js';

const handleForgotPassword = async (email) => {
  const url = createUrl('/user/forgotPassword');
log(email)
  try {
    log('Sending forgot password request...');
    const response = await axios.post(url, {
      email: email,
    });

    log('Response:', response.data);

    if (response.data.status === 'success') {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred while Resting your password.');
    }
  }
};

export default handleForgotPassword;
