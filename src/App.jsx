import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './components/layouts/AuthLayout';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

import GraduateLayout from './components/layouts/GraduateLayout';
import GraduateOnboarding from './pages/graduate/GraduateOnboarding';
import GraduateDashboard from './pages/graduate/GraduateDashboard';
import GraduateJobs from './pages/graduate/GraduateJobs';
import GraduateApplications from './pages/graduate/GraduateApplications';

import EmployerLayout from './components/layouts/EmployerLayout';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerPostJob from './pages/employer/EmployerPostJob';
import EmployerOnboarding from './pages/employer/EmployerOnboarding';
import EmployerApplications from './pages/employer/EmployerApplications';

import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SelectRole from './pages/auth/SelectRole';
import GraduateProfile from './pages/graduate/GraduateProfile';
import EmployerProfile from './pages/employer/EmployerProfile';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';

function App() {
  return (
    <Routes>
      {/* default */}
      <Route path='/' element={<Navigate to='/login' />} />

      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/select-role' element={<SelectRole />} />
      </Route>

      {/* graduate routes */}
      <Route element={<GraduateLayout />}>
        <Route path='/graduate/onboarding' element={<GraduateOnboarding />} />
        <Route path='/graduate/dashboard' element={<GraduateDashboard />} />
        <Route path='/graduate/jobs' element={<GraduateJobs />} />
        <Route path='/graduate/profile' element={<GraduateProfile />} />
        <Route
          path='/graduate/applications'
          element={<GraduateApplications />}
        />
      </Route>

      {/* employer routes */}
      <Route element={<EmployerLayout />}>
        <Route path='/employer/onboarding' element={<EmployerOnboarding />} />
        <Route path='/employer/dashboard' element={<EmployerDashboard />} />
        <Route path='/employer/post-job' element={<EmployerPostJob />} />
        <Route path='/employer/profile' element={<EmployerProfile />} />
        <Route
          path='/employer/applicants'
          element={<EmployerApplications />}
        />
      </Route>

      {/* admin routes */}
      <Route element={<AdminLayout />}>
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route path='/admin/jobs' element={<AdminJobs />} />
      </Route>
    </Routes>
  );
}

export default App;
