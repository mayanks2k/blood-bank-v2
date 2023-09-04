import React from 'react';
import { BrowserRouter, Route, Routes,Navigate, Outlet  } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserLogReg from './pages/user/userLogReg';
import UserHome from './pages/user/userHome';
import ForgotPass from './pages/user/forgetPass';
import UpdateProfileForm from './components/user/UpdateProfileForm';
import BloodRequestModal from './components/user/bloodReq';

import EmployeeLogin from './pages/employee/empLogIn';
import Dashboard from './pages/employee/empDash';
import UpdateStock from './pages/employee/empUpdateStock';
import BloodRequest from './pages/employee/empBloodReq';
import UpdateHealth from './pages/employee/empUpdateHealth';
import DonateRequest from './pages/employee/empDonateReq';
import DonorRecords from './pages/employee/empDonnerRecords';
import ResetPass from './pages/user/resetPass';

function App() {

  const UserProtectedRoutes = () => {
    const isUserLoggedIn = sessionStorage.getItem('isUserLoggedIn') === 'true';
    
    return isUserLoggedIn ? <Outlet /> : <Navigate to='/' />;
  };
  
  const EmployeeProtectedRoutes = () => {
    const isEmpLoggedIn = sessionStorage.getItem('isEmpLoggedIn') === 'true';
    
    return isEmpLoggedIn ? <Outlet /> : <Navigate to='/empLogin' />;
  };
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLogReg />} />
          <Route path="/userResetPassword" element={<ResetPass />} />
          <Route path="/userForgetPass" element={<ForgotPass />} />

          <Route element={<UserProtectedRoutes />}>
            <Route path="/userHome" element={<UserHome />} />
            <Route path="/userProfileUpdate" element={<UpdateProfileForm />} />
            <Route path="/userBloodRequest" element={<BloodRequestModal />} />
          </Route>

          <Route path="/empLogin" element={<EmployeeLogin />} />

          <Route element={<EmployeeProtectedRoutes />}>
            <Route path="/empDash" element={<Dashboard />} />
            <Route path="/empStock" element={<UpdateStock />} />
            <Route path="/empBloodReq" element={<BloodRequest />} />
            <Route path="/empUpdateHealth/:user_id" element={<UpdateHealth />} />
            <Route path="/empDonate" element={<DonateRequest />} />
            <Route path="/empDonorRecords" element={<DonorRecords />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
