import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Building2,
  LogOut,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import Modal from '../../components/ui/Modal';

const navLinks = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employer/post-job', label: 'Post a Job', icon: PlusCircle },
  { to: '/employer/applicants', label: 'Applicants', icon: Users },
  { to: '/employer/profile', label: 'Company Profile', icon: Building2 },
];

const EmployerSidebar = ({ closeMenu }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className='h-full min-h-screen w-64 flex flex-col overflow-y-auto border-r border-border bg-surface'>
        {/* Logo */}
        <div className='h-16 flex items-center px-6 border-b border-border'>
          <div className='flex items-center gap-2'>
            <img
              src={logo}
              alt='SkillBridge Logo'
              className='w-8 h-8 object-contain'
            />
            <span className='font-bold text-base text-text-heading'>
              SkillBridge
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 py-4 flex flex-col gap-1'>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive ? 'bg-primary text-white' : 'text-text hover:bg-border'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className='px-3 py-4 border-t border-border flex flex-col gap-1'>
          <button
            onClick={() => setShowLogoutModal(true)}
            className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-danger hover:bg-border transition-colors'
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <Modal
        isOpen={showLogoutModal}
        title='Sign out?'
        description='You will be returned to the login page and will need to sign in again to access your dashboard.'
        onClose={() => setShowLogoutModal(false)}
        footer={
          <>
            <button
              type='button'
              onClick={() => setShowLogoutModal(false)}
              className='rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-heading transition hover:bg-border'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleLogout}
              className='rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90'
            >
              Sign out
            </button>
          </>
        }
      />
    </>
  );
};

export default EmployerSidebar;
