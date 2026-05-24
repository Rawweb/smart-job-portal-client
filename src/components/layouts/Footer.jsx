import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => (
  <footer className='border-t border-border bg-surface'>
    <div className='container flex flex-col gap-6 py-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between'>
      <div className='flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg border border-border'>
            <img
              src={logo}
              alt='SkillBridge'
              className='h-6 w-6 object-contain'
            />
          </div>
          <span className='font-bold text-sm text-text-heading'>
            SkillBridge
          </span>
        </div>

        <span className='hidden h-4 w-px bg-border sm:block' />

        <p className='max-w-xl text-xs leading-5 text-text-muted'>
          Designed and built as a final year Computer Science dissertation
          project; Nnamdi Azikiwe University, Awka.
        </p>
      </div>

      <div className='flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-5 lg:justify-end'>
        <p className='text-xs text-text-muted'>
          Copyright 2026 RAWFILE. All rights reserved.
        </p>

        <div className='flex items-center gap-4'>
          <Link
            to='/login'
            className='text-xs font-medium text-text-muted transition-colors hover:text-text'
          >
            Sign in
          </Link>
          <Link
            to='/register'
            className='text-xs font-medium text-text-muted transition-colors hover:text-text'
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
