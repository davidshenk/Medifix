import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/authentication';
import Forbidden from '../pages/Forbidden';

const PrivateRoutes = ({ roles }) => {
  const { user, type } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to='/login' state={{ from: location }} replace />;

  if (!roles) {
    return <Outlet />;
  }

  if (!roles.includes(type)) {
    return <Forbidden />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
