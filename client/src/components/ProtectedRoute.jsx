import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthState } from '../utils/storage';

export default function ProtectedRoute() {
  const location = useLocation();

  if (!getAuthState().isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
