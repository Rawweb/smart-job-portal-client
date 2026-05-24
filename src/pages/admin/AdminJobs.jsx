import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const fetchAdminJobs = (params) =>
  api.get('/admin/jobs', { params }).then((res) => res.data);

const AdminJobs = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', page],
    queryFn: () => fetchAdminJobs({ page, limit: 20 }),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const toggleMutation = useMutation({
    mutationFn: (jobId) => api.patch(`/admin/jobs/${jobId}/toggle`),
    onSuccess: () => {
      toast.success('Job status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => toast.error('Failed to update job'),
  });

  const jobs = data?.jobs || [];
  const pagination = data?.pagination || {};

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>Jobs</h1>
        <p className='text-sm text-text-muted mt-1'>
          All jobs posted on the platform. Toggle to activate or deactivate.
        </p>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 size={28} className='animate-spin text-primary' />
        </div>
      ) : jobs.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 text-center'>
          <Briefcase size={40} className='text-text-muted mb-4' />
          <p className='font-semibold text-text-heading'>No jobs posted yet</p>
        </div>
      ) : (
        <>
          <div className='rounded-2xl border border-border bg-surface overflow-hidden'>
            {/* Header */}
            <div className='grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-bg text-xs font-semibold uppercase tracking-wide text-text-muted'>
              <div className='col-span-4'>Title</div>
              <div className='col-span-3'>Company</div>
              <div className='col-span-2'>Sector</div>
              <div className='col-span-1'>Apps</div>
              <div className='col-span-2'>Status</div>
            </div>

            {jobs.map((job, index) => (
              <div
                key={job._id}
                className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center text-sm
                  ${index !== jobs.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className='col-span-4'>
                  <p className='font-medium text-text-heading truncate'>
                    {job.title}
                  </p>
                  <p className='text-xs text-text-muted mt-0.5'>
                    {job.jobType}
                  </p>
                </div>

                <div className='col-span-3 text-text truncate'>
                  {job.companyName}
                </div>

                <div className='col-span-2 text-xs text-text-muted truncate'>
                  {job.sector}
                </div>

                <div className='col-span-1 text-text-heading font-medium'>
                  {job.applicationCount || 0}
                </div>

                <div className='col-span-2 flex items-center gap-2'>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium
                      ${
                        job.isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-border text-text-muted'
                      }`}
                  >
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleMutation.mutate(job._id)}
                    disabled={toggleMutation.isPending}
                    className='text-text-muted hover:text-primary transition-colors'
                    title={job.isActive ? 'Deactivate job' : 'Activate job'}
                  >
                    {job.isActive ? (
                      <ToggleRight size={20} className='text-success' />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-sm text-text-muted'>
                Showing {jobs.length} of {pagination.total} jobs
              </p>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className='rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-heading hover:bg-border disabled:opacity-40 transition-colors'
                >
                  Previous
                </button>
                <span className='text-sm text-text-muted'>
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className='rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-heading hover:bg-border disabled:opacity-40 transition-colors'
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminJobs;
