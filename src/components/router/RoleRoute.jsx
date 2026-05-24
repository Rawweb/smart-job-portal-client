import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';
import getRedirectPath from './getRedirectedPath';

// allowedRole is a string — 'graduate', 'employer', or 'admin'
// If the logged in user's role does not match, we redirect them
// to wherever they actually belong using getRedirectPath

const RoleRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  // Still verifying token — show spinner
  if (loading) return <PageLoader />;

  // Not logged in at all — send to login
  if (!user) return <Navigate to='/login' replace />;

  // Wrong role — redirect to their correct place
  // For example a graduate trying to access /employer/dashboard
  // gets sent back to /graduate/dashboard
  if (user.role !== allowedRole) {
    return <Navigate to={getRedirectPath(user)} replace />;
  }

  return children;
};

export default RoleRoute;
