import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  FileText,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import api from '../../api/axios';

const fetchAdminStats = () =>
  api.get('/admin/stats').then((res) => res.data.stats);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className='rounded-2xl border border-border bg-surface p-5 flex items-center gap-4'>
    <div
      className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className='text-2xl font-bold text-text-heading'>{value}</p>
      <p className='text-sm text-text-muted'>{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className='flex flex-col gap-8'>
      {/* ── Header ── */}
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>
          Admin Dashboard
        </h1>
        <p className='text-sm text-text-muted mt-1'>
          Platform overview and activity
        </p>
      </div>

      {/* ── Stats ── */}
      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='h-24 rounded-2xl border border-border bg-surface animate-pulse'
            />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <StatCard
            icon={Users}
            label='Total users'
            value={stats?.totalUsers ?? 0}
            color='var(--color-primary)'
          />
          <StatCard
            icon={GraduationCap}
            label='Graduates'
            value={stats?.totalGraduates ?? 0}
            color='var(--color-secondary)'
          />
          <StatCard
            icon={Building2}
            label='Employers'
            value={stats?.totalEmployers ?? 0}
            color='var(--color-success)'
          />
          <StatCard
            icon={Briefcase}
            label='Total jobs'
            value={stats?.totalJobs ?? 0}
            color='var(--color-warning)'
          />
          <StatCard
            icon={TrendingUp}
            label='Active jobs'
            value={stats?.activeJobs ?? 0}
            color='var(--color-success)'
          />
          <StatCard
            icon={FileText}
            label='Total applications'
            value={stats?.totalApplications ?? 0}
            color='var(--color-danger)'
          />
        </div>
      )}

      {/* ── Recent users + recent jobs ── */}
      {!isLoading && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent users */}
          <div className='rounded-2xl border border-border bg-surface p-6'>
            <h2 className='font-semibold text-text-heading mb-4'>
              Recently registered
            </h2>
            <div className='flex flex-col gap-3'>
              {stats?.recentUsers?.map((user) => (
                <div
                  key={user._id}
                  className='flex items-center justify-between gap-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary'>
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-text-heading truncate max-w-[180px]'>
                        {user.email}
                      </p>
                      <p className='text-xs text-text-muted capitalize'>
                        {user.role || 'No role yet'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isOnboarded
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {user.isOnboarded ? 'Active' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent jobs */}
          <div className='rounded-2xl border border-border bg-surface p-6'>
            <h2 className='font-semibold text-text-heading mb-4'>
              Recently posted jobs
            </h2>
            <div className='flex flex-col gap-3'>
              {stats?.recentJobs?.map((job) => (
                <div
                  key={job._id}
                  className='flex items-center justify-between gap-3'
                >
                  <div>
                    <p className='text-sm font-medium text-text-heading truncate max-w-[200px]'>
                      {job.title}
                    </p>
                    <p className='text-xs text-text-muted'>{job.sector}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      job.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-border text-text-muted'
                    }`}
                  >
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
