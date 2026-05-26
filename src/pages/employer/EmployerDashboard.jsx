import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  Users,
  CheckSquare,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const fetchEmployerStats = () =>
  api.get('/applications/employer/stats').then((res) => res.data.stats);

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

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['employer-stats', user?.id],
    queryFn: fetchEmployerStats,
    staleTime: 5 * 60 * 1000,
  });

  const displayName = stats?.companyName || '...';

  return (
    <div className='flex flex-col gap-8'>
      {/* ── Header ── */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-text-heading'>
            Welcome, {displayName} 👋
          </h1>
          <p className='text-text-muted text-sm mt-1'>
            Here is an overview of your recruitment activity.
          </p>
        </div>
        <button
          onClick={() => navigate('/employer/post-job')}
          className='flex items-center gap-2 self-start sm:self-auto rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
        >
          <PlusCircle size={16} />
          Post a job
        </button>
      </div>

      {/* ── Stats ── */}
      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='h-24 rounded-2xl border border-border bg-surface animate-pulse'
            />
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            icon={Briefcase}
            label='Total jobs posted'
            value={stats?.totalJobs ?? 0}
            color='var(--color-primary)'
          />
          <StatCard
            icon={TrendingUp}
            label='Active jobs'
            value={stats?.activeJobs ?? 0}
            color='var(--color-success)'
          />
          <StatCard
            icon={Users}
            label='Total applicants'
            value={stats?.totalApplications ?? 0}
            color='var(--color-secondary)'
          />
          <StatCard
            icon={CheckSquare}
            label='Shortlisted'
            value={stats?.shortlisted ?? 0}
            color='var(--color-warning)'
          />
        </div>
      )}

      {/* ── Recent jobs ── */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-lg font-semibold text-text-heading'>
              Recent job postings
            </h2>
            <p className='text-sm text-text-muted'>
              Your five most recently posted jobs
            </p>
          </div>
          <button
            onClick={() => navigate('/employer/applicants')}
            className='text-sm font-medium text-primary hover:underline flex items-center gap-1'
          >
            View applicants
            <ArrowRight size={14} />
          </button>
        </div>

        {isLoading ? (
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className='h-16 rounded-2xl border border-border bg-surface animate-pulse'
              />
            ))}
          </div>
        ) : !stats?.recentJobs?.length ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center'>
            <Briefcase size={36} className='text-text-muted mb-3' />
            <p className='font-semibold text-text-heading'>
              No jobs posted yet
            </p>
            <p className='text-sm text-text-muted mt-1'>
              Your posted jobs will appear here
            </p>
            <button
              onClick={() => navigate('/employer/post-job')}
              className='mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
            >
              <PlusCircle size={15} />
              Post your first job
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {stats.recentJobs.map((job) => (
              <div
                key={job._id}
                className='flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-5 py-4 hover:border-primary/40 transition-colors cursor-pointer'
                onClick={() => navigate(`/employer/applicants?job=${job._id}`)}
              >
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-text-heading truncate'>
                    {job.title}
                  </p>
                  <p className='text-xs text-text-muted mt-0.5'>
                    {job.sector} · {job.jobType}
                  </p>
                </div>

                <div className='flex items-center gap-4 shrink-0'>
                  <div className='text-right'>
                    <p className='text-sm font-semibold text-text-heading'>
                      {job.applicationCount}
                    </p>
                    <p className='text-xs text-text-muted'>applicants</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${
                        job.isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-border text-text-muted'
                      }`}
                  >
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>

                  <ArrowRight size={16} className='text-text-muted' />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
