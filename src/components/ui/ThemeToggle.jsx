import { Sun, Moon } from 'lucide-react';
import  useTheme  from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label='Toggle theme'
      className='flex items-center justify-center border border-border bg-surface p-2 rounded-full text-text hover:bg-bg transition'
    >
      {theme === 'dark' ? (
        <Sun className='size-5' />
      ) : (
        <Moon className='size-5' />
      )}
    </button>
  );
}
