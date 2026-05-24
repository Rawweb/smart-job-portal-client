import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  FileText,
  BarChart3,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/ui/JobCard';

// ── Fetch functions ───────────────────────────────────────
// These are plain async functions that call the API
// We pass them to useQuery which handles loading, error, caching

const fetchStats = () =>
  api.get('/jobs/graduate/stats').then((res) => res.data.stats);

const fetchTopJobs = () =>
  api.get('/jobs?limit=4').then((res) => res.data.jobs);

// ── Stat Card ────────────────────────────────────────────
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

// ── Main Component ────────────────────────────────────────
const GraduateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // useQuery takes a queryKey and a queryFn
  // queryKey — a unique name for this data. If you use the same key
  //            elsewhere React Query returns the cached version instantly
  // queryFn  — the async function that fetches the data
  // staleTime — how long before React Query considers the data outdated
  //             and refetches. 5 minutes here means no unnecessary requests

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['graduate-stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: topJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['top-jobs'],
    queryFn: fetchTopJobs,
    staleTime: 5 * 60 * 1000, 
  });

  // Greet based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = stats?.fullName
    ? stats.fullName.split(' ')[0]
    : user?.email?.split('@')[0];

  return (
    <div className='flex flex-col gap-8'>
      {/* ── Welcome header ── */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-text-heading'>
            {getGreeting()}, {displayName} 👋
          </h1>
          <p className='text-text-muted text-sm mt-1'>
            Here is what is happening with your job search today.
          </p>
        </div>

        <button
          onClick={() => navigate('/graduate/jobs')}
          className='flex items-center gap-2 self-start sm:self-auto rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
        >
          Browse all jobs
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Stats row ── */}
      {statsLoading ? (
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
            label='Available jobs'
            value={stats?.totalJobs ?? 0}
            color='var(--color-primary)'
          />
          <StatCard
            icon={FileText}
            label='Applications sent'
            value={stats?.totalApplications ?? 0}
            color='var(--color-secondary)'
          />
          <StatCard
            icon={BarChart3}
            label='Avg. match score'
            value={`${stats?.avgCompatibilityScore ?? 0}%`}
            color='var(--color-success)'
          />
          <StatCard
            icon={Layers}
            label='Skills in profile'
            value={stats?.skillsCount ?? 0}
            color='var(--color-warning)'
          />
        </div>
      )}

      {/* ── Top job matches ── */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-lg font-semibold text-text-heading'>
              Top matches for you
            </h2>
            <p className='text-sm text-text-muted'>
              Jobs ranked by your skill compatibility
            </p>
          </div>
          <button
            onClick={() => navigate('/graduate/jobs')}
            className='text-sm font-medium text-primary hover:underline flex items-center gap-1'
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>

        {jobsLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='h-52 rounded-2xl border border-border bg-surface animate-pulse'
              />
            ))}
          </div>
        ) : !topJobs?.length ? (
          <div className='rounded-2xl border border-border bg-surface p-10 text-center'>
            <Briefcase size={32} className='text-text-muted mx-auto mb-3' />
            <p className='text-text-heading font-medium'>No jobs posted yet</p>
            <p className='text-sm text-text-muted mt-1'>
              Check back soon, employers are setting up their accounts.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {topJobs.slice(0, 4).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GraduateDashboard;
