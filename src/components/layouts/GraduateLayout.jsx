import { Outlet } from 'react-router-dom';
import GraduateHeader from '../../pages/graduate/GraduateHeader';
import GraduateSidebar from '../../pages/graduate/GraduateSidebar';
import { useState } from 'react';

const GraduateLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='min-h-screen bg-bg md:pl-64'>
      {/* overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className='fixed inset-0 z-30 bg-black/30 backdrop-blur-xs md:hidden'
        />
      )}
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <GraduateSidebar closeMenu={() => setOpen(false)} />
      </div>

      {/* Main */}
      <div className='flex min-h-screen min-w-0 flex-col'>
        {/* Top bar */}
        <GraduateHeader openMenu={() => setOpen(true)} />

        {/* Page content */}
        <main className='flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GraduateLayout;
