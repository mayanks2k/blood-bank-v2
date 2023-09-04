import React, { useState } from 'react';
import '../../assets/styles/user/userLogReg.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGooglePlusG, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import handleSignIn from '../../services/user/signIn';
import handleSignUp from '../../services/user/signUp';

const UserLogReg = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setUserEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSignInClick = async () => {
    if (email.trim() === '' || password.trim() === '') {
      toast.error('Please fill in all fields.');
      return;
    }
    await handleSignIn(email, password, navigate);
  };

  const handleSignUpClick = async () => {
    if (email.trim() === '' || password.trim() === '' || firstName.trim() === '') {
      toast.error('Please fill in all fields.');
      return;
    }
    await handleSignUp(email, password, navigate, firstName);
  };

  return (
    <div className={`containerLogReg ${isSignUp ? 'right-panel-active' : ''}`} id="containerLogReg">
      <div className="form-containerLogReg sign-up-containerLogReg">
      <form className="formLogReg" >
          <h1>Create Account</h1>
          <div className="social-containerLogReg">
  <a href="#" className="social"><FontAwesomeIcon icon={faFacebookF} /></a>
  <a href="#" className="social"><FontAwesomeIcon icon={faGooglePlusG} /></a>
  <a href="#" className="social"><FontAwesomeIcon icon={faLinkedinIn} /></a>
  </div>

  <span>or use your email for registration</span>
            <input className="logRegInput" type="text" placeholder="Frist Name" onChange={(e) => setFirstName(e.target.value)} />
            <input className="logRegInput" placeholder="Email" value={email} onChange={(e) => setUserEmail(e.target.value)} />
            <input className="logRegInput" type="password" placeholder="Password" value={password} onChange={(e) => setUserPassword(e.target.value)} />
            <buttonLogReg onClick={handleSignUpClick} >Sign Up</buttonLogReg>
</form>
      </div>
      <div className="form-containerLogReg sign-in-containerLogReg">
      <form action="#" className="formLogReg">
          <h1>Sign In</h1>
          <div className="social-containerLogReg">
            <a href="#" className="social"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faGooglePlusG} /></a>
            <a href="#" className="social"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
          <span>or use your account</span>
          <input
          className="logRegInput"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <input
          className="logRegInput"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setUserPassword(e.target.value)}
          />
<Link to='/userForgetPass'>Forgot your password? </Link>          
        <buttonLogReg onClick={handleSignInClick}>Sign In</buttonLogReg>
        </form>
      </div>
      <div className="overlay-containerLogReg">
      <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us, please login with your credentials </p>
            <buttonLogReg className="ghost" id="signIn" onClick={toggleForm}>Sign In</buttonLogReg>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Start your well-being journey with Virtue Blood Bank</p>
            <buttonLogReg className="ghost" id="signUp" onClick={toggleForm}>Sign Up</buttonLogReg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogReg;
