import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import ThemeToggle from "../ui/ThemeToggle";
import { ArrowRight, ChevronRight } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className='sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
            <img
              src={logo}
              alt='SkillBridge'
              className='h-5 w-5 object-contain'
            />
          </div>
          <span className='font-bold text-base text-text-heading'>
            SkillBridge
          </span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <nav className='hidden md:flex items-center gap-6'>
          <a
            href='#features'
            className='text-sm font-medium text-text hover:text-text-heading transition-colors'
          >
            Features
          </a>

          <a
            href='#how-it-works'
            className='text-sm font-medium text-text hover:text-text-heading transition-colors'
          >
            How it works
          </a>

          <a
            href='#sectors'
            className='text-sm font-medium text-text hover:text-text-heading transition-colors'
          >
            Sectors
          </a>
        </nav>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          <ThemeToggle />

          {user ? (
            <button
              onClick={() => navigate(getRedirectPath(user))}
              className='flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
            >
              Go to dashboard
              <ChevronRight size={15} />
            </button>
          ) : (
            <>
              <Link
                to='/login'
                className='hidden sm:block text-sm font-medium text-text hover:text-text-heading transition-colors'
              >
                Sign in
              </Link>
              <Link
                to='/register'
                className='flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
              >
                Get started
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;