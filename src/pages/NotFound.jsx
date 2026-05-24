import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import getRedirectPath from '../components/router/getRedirectedPath';

const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If the user is logged in, the home button sends them to their dashboard
  // If not logged in, it sends them to the login page
  const handleHome = () => {
    if (user) {
      navigate(getRedirectPath(user));
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='flex flex-col items-center text-center max-w-md'
      >
        {/* Large 404 */}
        <div className='relative mb-6'>
          <p
            className='text-9xl font-black select-none'
            style={{ color: 'var(--color-border)' }}
          >
            404
          </p>
          {/* Overlaid label */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <span className='rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white'>
              Page not found
            </span>
          </div>
        </div>

        <h1 className='text-xl font-bold text-text-heading'>
          This page does not exist
        </h1>
        <p className='mt-2 text-sm text-text-muted leading-relaxed'>
          The page you are looking for may have been moved, deleted, or never
          existed. Check the URL and try again.
        </p>

        {/* Actions */}
        <div className='mt-8 flex flex-col sm:flex-row items-center gap-3'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-heading hover:bg-border transition-colors'
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          <button
            onClick={handleHome}
            className='flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
          >
            <Home size={16} />
            {user ? 'Go to dashboard' : 'Go to login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
