import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Logic: Is there a signed-in identity?
  return userInfo ? (
    <Outlet /> // This renders the protected screen (Orders/Profile/Addresses)
  ) : (
    <Navigate to='/login' replace />
  );
};

export default PrivateRoute;
