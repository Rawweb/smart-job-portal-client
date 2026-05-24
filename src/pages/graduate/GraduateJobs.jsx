import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, SlidersHorizontal, Briefcase, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import JobCard from '../../components/ui/JobCard';

const sectors = [
  'All Sectors',
  'Information Technology',
  'Banking and Finance',
  'Education',
  'Healthcare Administration',
  'Engineering and Technical Services',
];

const jobTypes = [
  'All Types',
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
];

// Build query string from filter object
// This means if sector is 'All Sectors' we don't send it to the API
const buildParams = (filters) => {
  const params = {};
  if (filters.search.trim()) params.search = filters.search.trim();
  if (filters.sector !== 'All Sectors') params.sector = filters.sector;
  if (filters.jobType !== 'All Types') params.jobType = filters.jobType;
  return params;
};

const GraduateJobs = () => {
  const [filters, setFilters] = useState({
    search: '',
    sector: 'All Sectors',
    jobType: 'All Types',
  });

  // This is a "derived" state — we don't store it separately
  // It's just a flag that tells us if any filter is active
  const hasActiveFilters =
    filters.search ||
    filters.sector !== 'All Sectors' ||
    filters.jobType !== 'All Types';

  // queryKey includes filters — React Query re-fetches automatically
  // whenever the key changes (i.e. when filters change)
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () =>
      api
        .get('/jobs', { params: buildParams(filters) })
        .then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    // keepPreviousData: true means the old results stay visible
    // while new results are being fetched — no flash of empty screen
    placeholderData: (prev) => prev,
  });

  const jobs = data?.jobs || [];

  const clearFilters = () => {
    setFilters({ search: '', sector: 'All Sectors', jobType: 'All Types' });
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* ── Page header ── */}
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>Browse Jobs</h1>
        <p className='text-sm text-text-muted mt-1'>
          Jobs are ranked by your skill compatibility score
        </p>
      </div>

      {/* ── Search + Filters ── */}
      <div className='flex flex-col gap-3'>
        {/* Search bar */}
        <div className='relative'>
          <Search
            size={16}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted'
          />
          <input
            type='text'
            placeholder='Search by job title...'
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className='w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text'
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className='flex flex-wrap items-center gap-3'>
          <SlidersHorizontal size={15} className='text-text-muted shrink-0' />

          {/* Sector filter */}
          <select
            value={filters.sector}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sector: e.target.value }))
            }
            className='rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary transition-all'
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Job type filter */}
          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, jobType: e.target.value }))
            }
            className='rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary transition-all'
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='flex items-center gap-1.5 text-sm font-medium text-danger hover:opacity-80 transition-opacity'
            >
              <X size={14} />
              Clear filters
            </button>
          )}

          {/* Results count — shows while not loading */}
          {!isLoading && (
            <span className='ml-auto text-sm text-text-muted'>
              {/* isFetching is true during background refetches */}
              {isFetching ? (
                <span className='flex items-center gap-1.5'>
                  <Loader2 size={13} className='animate-spin' />
                  Updating...
                </span>
              ) : (
                `${jobs.length} job${jobs.length !== 1 ? 's' : ''} found`
              )}
            </span>
          )}
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      {isLoading ? (
        // Skeleton loading state — same grid layout as real cards
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='h-56 rounded-2xl border border-border bg-surface animate-pulse'
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        // Empty state
        <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 text-center'>
          <Briefcase size={40} className='text-text-muted mb-4' />
          <p className='font-semibold text-text-heading'>No jobs found</p>
          <p className='text-sm text-text-muted mt-1 max-w-xs'>
            {hasActiveFilters
              ? 'Try adjusting your filters or clearing your search.'
              : 'No jobs have been posted yet. Check back soon.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='mt-4 text-sm font-medium text-primary hover:underline'
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GraduateJobs;
