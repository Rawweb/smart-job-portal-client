import { Routes, Route, Navigate } from 'react-router-dom';

// auth layout - routes
import AuthLayout from './components/layouts/AuthLayout';
import GraduateLayout from './components/layouts/GraduateLayout';
import EmployerLayout from './components/layouts/EmployerLayout';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayouts';

// auth pages
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

// guards
import PublicRoute from './components/router/PublicRoute';
import ProtectedRoute from './components/router/ProtectedRoute';

// graduate pages
import GraduateOnboarding from './pages/graduate/GraduateOnboarding';
import GraduateDashboard from './pages/graduate/GraduateDashboard';
import GraduateJobs from './pages/graduate/GraduateJobs';
import JobDetail from './pages/graduate/JobDetail';
import GraduateApplications from './pages/graduate/GraduateApplications';

// employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerPostJob from './pages/employer/EmployerPostJob';
import EmployerOnboarding from './pages/employer/EmployerOnboarding';
import EmployerApplicants from './pages/employer/EmployerApplicants';

// admin pages

import AdminDashboard from './pages/admin/AdminDashboard';
import SelectRole from './pages/auth/SelectRole';
import GraduateProfile from './pages/graduate/GraduateProfile';
import EmployerProfile from './pages/employer/EmployerProfile';
import AdminUsers from './pages/admin/AdminUsers';
import AdminJobs from './pages/admin/AdminJobs';

// user pages
import Landing from './pages/Landing';
import RoleRoute from './components/router/RoleRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* default */}
      <Route element={<UserLayout />}>
        <Route path='/' element={<Landing />} />
      </Route>

      {/* auth routes */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>

      <Route
        path='/select-role'
        element={
          <ProtectedRoute>
            <SelectRole />
          </ProtectedRoute>
        }
      />

      {/* graduate routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole='graduate'>
              <GraduateLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path='/graduate/dashboard' element={<GraduateDashboard />} />
        <Route path='/graduate/jobs' element={<GraduateJobs />} />
        <Route path='/graduate/jobs/:id' element={<JobDetail />} />
        <Route path='/graduate/profile' element={<GraduateProfile />} />
        <Route path='/graduate/jobs/:id' element={<JobDetail />} />
        <Route
          path='/graduate/applications'
          element={<GraduateApplications />}
        />
      </Route>

      {/* employer routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole='employer'>
              <EmployerLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path='/employer/dashboard' element={<EmployerDashboard />} />
        <Route path='/employer/post-job' element={<EmployerPostJob />} />
        <Route path='/employer/profile' element={<EmployerProfile />} />
        <Route path='/employer/applicants' element={<EmployerApplicants />} />
      </Route>

      {/* standalone routes - no sidebar during onboarding */}
      <Route
        path='/graduate/onboarding'
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole='graduate'>
              <GraduateOnboarding />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path='/employer/onboarding'
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole='employer'>
              <EmployerOnboarding />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* admin routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleRoute allowedRole='admin'>
              <AdminLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/users' element={<AdminUsers />} />
        <Route path='/admin/jobs' element={<AdminJobs />} />
      </Route>

      {/* 404 - Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
