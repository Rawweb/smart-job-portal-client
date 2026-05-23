import ThemeToggle from './components/ui/ThemeToggle';
import useTheme from './hooks/useTheme';

function App() {
  useTheme();
  return (
    <div>
      <h1 className='text-primary'>Smart Job Portal - Kingsley</h1>
    </div>
  );
}

export default App;
