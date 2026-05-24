import { useQuery } from '@tanstack/react-query';
import { FileText, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/ui/StatusBadge';
import ScoreCircle from '../../components/ui/ScoreCircle';

const fetchMyApplications = () =>
  api.get('/applications/my').then((res) => res.data.applications);

const GraduateApplications = () => {
  const navigate = useNavigate();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: fetchMyApplications,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>
          My Applications
        </h1>
        <p className='text-sm text-text-muted mt-1'>
          Track the status of all your submitted applications
        </p>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 size={28} className='animate-spin text-primary' />
        </div>
      ) : !applications?.length ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 text-center'>
          <FileText size={40} className='text-text-muted mb-4' />
          <p className='font-semibold text-text-heading'>No applications yet</p>
          <p className='text-sm text-text-muted mt-1'>
            Browse jobs and apply to ones that match your skills
          </p>
          <button
            onClick={() => navigate('/graduate/jobs')}
            className='mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
          >
            Browse jobs
            <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {applications.map((app) => (
            <div
              key={app._id}
              className='flex items-center gap-4 rounded-2xl border border-border bg-surface p-5
                hover:border-primary/40 transition-colors cursor-pointer'
              onClick={() => navigate(`/graduate/jobs/${app.job?._id}`)}
            >
              {/* Score */}
              <ScoreCircle
                score={app.skillGapResult?.compatibilityScore ?? 0}
                size={52}
              />

              {/* Job info */}
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-text-heading truncate'>
                  {app.job?.title || 'Unknown Job'}
                </p>
                <p className='text-sm text-text-muted mt-0.5'>
                  {app.companyName}
                </p>

                {/* Matched / missing summary */}
                <div className='flex items-center gap-3 mt-2 text-xs text-text-muted'>
                  <span className='text-success font-medium'>
                    {app.skillGapResult?.matchedSkills?.length || 0} matched
                  </span>
                  <span>·</span>
                  <span className='text-danger font-medium'>
                    {app.skillGapResult?.missingSkills?.length || 0} missing
                  </span>
                </div>
              </div>

              {/* Right side — status + date */}
              <div className='flex flex-col items-end gap-2 shrink-0'>
                <StatusBadge status={app.status} />
                <p className='text-xs text-text-muted'>
                  {new Date(app.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GraduateApplications;
