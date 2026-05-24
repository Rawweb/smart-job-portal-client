import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';
import getRedirectPath from './getRedirectedPath';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  // Already logged in — send them where they belong
  if (user) return <Navigate to={getRedirectPath(user)} replace />;

  return children;
};

export default PublicRoute;
