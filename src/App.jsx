import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import GraduateLayout from './components/layouts/GraduateLayout';
import GraduateOnboarding from './pages/graduate/GraduateOnboarding';
import GraduateDashboard from './pages/graduate/GraduateDashboard';
import AuthLayout from './components/layouts/AuthLayout';
import Register from './pages/auth/Register';

function App() {
  return (
    <Routes>
      {/* default */}
      <Route path='/' element={<Navigate to='/login' />} />

      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>

      {/* graduate routes */}
      <Route element={<GraduateLayout />}>
        <Route path='/graduate/onboarding' element={<GraduateOnboarding />} />
        <Route path='/graduate/dashboard' element={<GraduateDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
