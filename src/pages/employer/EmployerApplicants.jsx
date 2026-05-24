import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import ScoreCircle from '../../components/ui/ScoreCircle';
import StatusBadge from '../../components/ui/StatusBadge';
import { useSearchParams } from 'react-router-dom';

// First we need to get the employer's jobs
// so they can pick which job's applicants to view
const fetchEmployerJobs = () => api.get('/jobs').then((res) => res.data.jobs);

const fetchApplicants = (jobId) =>
  api.get(`/applications/job/${jobId}`).then((res) => res.data);

const statuses = ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'];

const EmployerApplicants = () => {
  const [searchParams] = useSearchParams();
  const [selectedJobId, setSelectedJobId] = useState(
    searchParams.get('job') || ''
  );
  const queryClient = useQueryClient();

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: fetchEmployerJobs,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading: applicantsLoading } = useQuery({
    queryKey: ['applicants', selectedJobId],
    queryFn: () => fetchApplicants(selectedJobId),
    // Only runs when a job is selected
    enabled: !!selectedJobId,
    staleTime: 2 * 60 * 1000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ applicationId, status }) =>
      api.patch(`/applications/${applicationId}/status`, { status }),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({
        queryKey: ['applicants', selectedJobId],
      });
      queryClient.invalidateQueries({ queryKey: ['employer-stats'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const jobs = jobsData || [];
  const applications = data?.applications || [];

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>Applicants</h1>
        <p className='text-sm text-text-muted mt-1'>
          Select a job to view applicants ranked by skill compatibility
        </p>
      </div>

      {/* Job selector */}
      <div className='relative w-full sm:max-w-sm'>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className='w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 pr-10 text-sm text-text outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
        >
          <option value=''>
            {jobsLoading
              ? 'Loading your jobs...'
              : 'Select a job to view applicants'}
          </option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title} ({job.applicationCount || 0} applicants)
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted'
        />
      </div>

      {/* Applicants list */}
      {!selectedJobId ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center'>
          <Users size={40} className='text-text-muted mb-4' />
          <p className='font-semibold text-text-heading'>Select a job above</p>
          <p className='text-sm text-text-muted mt-1'>
            Applicants are ranked by skill compatibility score
          </p>
        </div>
      ) : applicantsLoading ? (
        <div className='flex items-center justify-center py-16'>
          <Loader2 size={28} className='animate-spin text-primary' />
        </div>
      ) : applications.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 text-center'>
          <Users size={40} className='text-text-muted mb-4' />
          <p className='font-semibold text-text-heading'>No applicants yet</p>
          <p className='text-sm text-text-muted mt-1'>
            Applications will appear here once graduates apply
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {/* Column headers */}
          <div className='hidden sm:grid grid-cols-12 gap-4 px-5 text-xs font-semibold uppercase tracking-wide text-text-muted'>
            <div className='col-span-1'>Score</div>
            <div className='col-span-4'>Applicant</div>
            <div className='col-span-3'>Skills</div>
            <div className='col-span-2'>Applied</div>
            <div className='col-span-2'>Status</div>
          </div>

          {applications.map((app) => {
            const profile = app.graduateProfile || {};
            const score = app.skillGapResult?.compatibilityScore ?? 0;

            return (
              <div
                key={app._id}
                className='rounded-2xl border border-border bg-surface p-5'
              >
                <div className='grid grid-cols-1 sm:grid-cols-12 gap-4 items-center'>
                  {/* Score */}
                  <div className='sm:col-span-1'>
                    <ScoreCircle score={score} size={48} />
                  </div>

                  {/* Applicant info */}
                  <div className='sm:col-span-4'>
                    <p className='font-semibold text-text-heading text-sm'>
                      {profile.fullName || app.applicant?.email || 'Applicant'}
                    </p>
                    <p className='text-xs text-text-muted mt-0.5'>
                      {app.applicant?.email}
                    </p>
                    {profile.qualification && (
                      <p className='text-xs text-text-muted mt-0.5'>
                        {profile.qualification}
                        {profile.fieldOfStudy
                          ? ` · ${profile.fieldOfStudy}`
                          : ''}
                      </p>
                    )}
                  </div>

                  {/* Skill summary */}
                  <div className='sm:col-span-3'>
                    <p className='text-xs font-medium text-success mb-1'>
                      {app.skillGapResult?.matchedSkills?.length || 0} matched
                    </p>
                    <div className='flex flex-wrap gap-1'>
                      {app.skillGapResult?.matchedSkills
                        ?.slice(0, 3)
                        .map((s) => (
                          <span
                            key={s}
                            className='rounded-full bg-success/10 px-2 py-0.5 text-xs text-success'
                          >
                            {s}
                          </span>
                        ))}
                      {(app.skillGapResult?.matchedSkills?.length || 0) > 3 && (
                        <span className='text-xs text-text-muted'>
                          +{app.skillGapResult.matchedSkills.length - 3} more
                        </span>
                      )}
                    </div>
                    {(app.skillGapResult?.missingSkills?.length || 0) > 0 && (
                      <p className='text-xs text-danger mt-1'>
                        {app.skillGapResult.missingSkills.length} missing
                      </p>
                    )}
                  </div>

                  {/* Date applied */}
                  <div className='sm:col-span-2'>
                    <p className='text-xs text-text-muted'>
                      {new Date(app.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>

                  {/* Status dropdown */}
                  <div className='sm:col-span-2'>
                    <div className='relative'>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            applicationId: app._id,
                            status: e.target.value,
                          })
                        }
                        className='w-full appearance-none rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-medium text-text outline-none focus:ring-2 focus:ring-primary cursor-pointer'
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='mt-1.5'>
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                </div>

                {/* Cover letter — shown if provided */}
                {app.coverLetter && (
                  <div className='mt-4 rounded-xl bg-bg p-3 border border-border'>
                    <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-1'>
                      Cover letter
                    </p>
                    <p className='text-xs text-text leading-relaxed line-clamp-3'>
                      {app.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerApplicants;
