import { Menu, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ openMenu }) => {
  const { user } = useAuth();

  return (
    <header className='sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6 lg:px-8'>
      {/* Mobile menu button */}
      <button
        onClick={openMenu}
        className='rounded p-2 hover:bg-border md:hidden'
        aria-label='Open navigation menu'
      >
        <Menu size={20} />
      </button>

      <div className='ml-auto flex min-w-0 items-center gap-3'>
        {/* Admin badge — visible on larger screens */}
        <div className='hidden sm:flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1'>
          <ShieldCheck size={13} className='text-warning' />
          <span className='text-xs font-semibold text-warning'>Admin</span>
        </div>

        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning text-sm font-semibold text-white'>
          {user?.email?.[0]?.toUpperCase() || 'A'}
        </div>

        <span className='hidden max-w-[45vw] truncate text-sm font-medium text-text-heading sm:block lg:max-w-none'>
          {user?.email || 'Admin'}
        </span>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default AdminHeader;
