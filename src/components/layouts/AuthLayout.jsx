import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-bg'>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
