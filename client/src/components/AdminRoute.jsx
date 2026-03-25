import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Logic: Is there a user? And is that user an Admin?
  return userInfo && userInfo.isAdmin ? (
    <Outlet /> // This renders the child components (Dashboard/ProductList)
  ) : (
    <Navigate to='/login' replace />
  );
};

export default AdminRoute;