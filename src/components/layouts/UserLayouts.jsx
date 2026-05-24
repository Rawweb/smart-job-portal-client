import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const UserLayout = () => {
  return (
    <div className='min-h-screen flex flex-col bg-bg text-text'>
      {/* navbar*/}
      <Navbar />

      {/* main content */}
      <main className='flex-1'>
        <Outlet />
      </main>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;
