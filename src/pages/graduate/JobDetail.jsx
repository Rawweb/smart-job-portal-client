import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  Globe,
  Send,
  Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import ScoreCircle from '../../components/ui/ScoreCircle'

// ── Fetch job detail ──────────────────────
const fetchJob = (id) =>
  api.get(`/jobs/${id}`).then((res) => res.data.job)

const JobDetail = () => {
  const { id } = useParams()
  // useParams reads the :id part from the URL
  // /graduate/jobs/abc123 → id = "abc123"

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // queryClient lets us invalidate (clear) cached data
  // so React Query refetches fresh data after we apply

  const [coverLetter, setCoverLetter] = useState('')
  const [showApplyForm, setShowApplyForm] = useState(false)

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJob(id),
    staleTime: 2 * 60 * 1000,
  })

  // useMutation is for POST/PATCH/DELETE operations
  // Unlike useQuery it does not run automatically
  // You call mutate() when the user takes an action
  const applyMutation = useMutation({
    mutationFn: () =>
      api.post('/applications', {
        jobId: id,
        coverLetter,
      }),
    onSuccess: () => {
      toast.success('Application submitted successfully!')
      setShowApplyForm(false)

      // Invalidate these queries so their cached data is cleared
      // React Query will refetch them fresh on next access
      queryClient.invalidateQueries({ queryKey: ['job', id] })
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      queryClient.invalidateQueries({ queryKey: ['graduate-stats'] })
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to apply'
      toast.error(message)
    },
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 size={28} className='animate-spin text-primary' />
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <p className='text-text-heading font-semibold'>Job not found</p>
        <button
          onClick={() => navigate('/graduate/jobs')}
          className='text-sm text-primary hover:underline'
        >
          Back to jobs
        </button>
      </div>
    )
  }

  const { skillGap, hasApplied } = job

  return (
    <div className='flex flex-col gap-6 max-w-4xl'>

      {/* ── Back button ── */}
      <button
        onClick={() => navigate('/graduate/jobs')}
        className='flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-heading transition-colors w-fit'
      >
        <ArrowLeft size={16} />
        Back to jobs
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

        {/* ── Left column — main info ── */}
        <div className='lg:col-span-2 flex flex-col gap-5'>

          {/* Job header card */}
          <div className='rounded-2xl border border-border bg-surface p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex items-start gap-4'>
                {/* Company avatar */}
                <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary'>
                  {(job.companyName || 'C')[0].toUpperCase()}
                </div>
                <div>
                  <h1 className='text-xl font-bold text-text-heading'>
                    {job.title}
                  </h1>
                  <p className='text-text-muted text-sm mt-0.5'>
                    {job.companyName}
                  </p>
                </div>
              </div>

              {/* Score */}
              {skillGap && (
                <ScoreCircle score={skillGap.compatibilityScore} size={64} />
              )}
            </div>

            {/* Meta info pills */}
            <div className='flex flex-wrap gap-2 mt-4'>
              {[
                { icon: Briefcase, text: job.jobType },
                { icon: Briefcase, text: job.sector },
                { icon: Briefcase, text: job.experienceLevel },
                job.location && { icon: MapPin, text: job.location },
              ]
                .filter(Boolean)
                .map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className='flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-text'
                  >
                    <Icon size={11} />
                    {text}
                  </span>
                ))}
            </div>

            {/* Salary */}
            {job.salary?.min && (
              <p className='mt-3 text-sm font-semibold text-success'>
                ₦{job.salary.min.toLocaleString()}
                {job.salary.max ? ` – ₦${job.salary.max.toLocaleString()}` : '+'}
                {job.salary.isNegotiable && ' (Negotiable)'}
              </p>
            )}
          </div>

          {/* Description */}
          <div className='rounded-2xl border border-border bg-surface p-6'>
            <h2 className='font-semibold text-text-heading mb-3'>
              Job Description
            </h2>
            {/* whitespace-pre-line preserves line breaks from the textarea */}
            <p className='text-sm text-text leading-relaxed whitespace-pre-line'>
              {job.description}
            </p>
          </div>

          {/* Required skills */}
          {job.requiredSkills?.length > 0 && (
            <div className='rounded-2xl border border-border bg-surface p-6'>
              <h2 className='font-semibold text-text-heading mb-3'>
                Required Skills
              </h2>
              <div className='flex flex-wrap gap-2'>
                {job.requiredSkills.map((skill) => {
                  // Check if this skill is in the graduate's matched list
                  const isMatched = skillGap?.matchedSkills?.includes(skill)
                  const isMissing = skillGap?.missingSkills?.includes(skill)

                  return (
                    <span
                      key={skill}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border
                        ${
                          isMatched
                            ? 'border-success/30 bg-success/10 text-success'
                            : isMissing
                            ? 'border-danger/30 bg-danger/10 text-danger'
                            : 'border-border text-text'
                        }`}
                    >
                      {isMatched && <CheckCircle2 size={11} />}
                      {isMissing && <XCircle size={11} />}
                      {skill}
                    </span>
                  )
                })}
              </div>

              {/* Legend */}
              {skillGap && (
                <div className='flex items-center gap-4 mt-4 pt-4 border-t border-border'>
                  <span className='flex items-center gap-1.5 text-xs text-success'>
                    <CheckCircle2 size={12} />
                    You have this skill
                  </span>
                  <span className='flex items-center gap-1.5 text-xs text-danger'>
                    <XCircle size={12} />
                    You are missing this
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right column — skill gap + apply ── */}
        <div className='flex flex-col gap-5'>

          {/* Apply card */}
          <div className='rounded-2xl border border-border bg-surface p-5'>
            {hasApplied ? (
              <div className='flex flex-col items-center text-center gap-3 py-2'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-success/10'>
                  <CheckCircle2 size={24} className='text-success' />
                </div>
                <div>
                  <p className='font-semibold text-text-heading'>
                    Application sent
                  </p>
                  <p className='text-xs text-text-muted mt-0.5'>
                    You have already applied for this role
                  </p>
                </div>
                <button
                  onClick={() => navigate('/graduate/applications')}
                  className='text-sm text-primary font-medium hover:underline'
                >
                  View my applications
                </button>
              </div>
            ) : showApplyForm ? (
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='font-semibold text-text-heading'>
                    Apply for this role
                  </h3>
                  <p className='text-xs text-text-muted mt-0.5'>
                    Add an optional cover letter
                  </p>
                </div>
                <textarea
                  rows={5}
                  placeholder='Tell the employer why you are a great fit...'
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className='w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all'
                />
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={() => applyMutation.mutate()}
                    disabled={applyMutation.isPending}
                    className='flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors'
                  >
                    {applyMutation.isPending ? (
                      <>
                        <Loader2 size={15} className='animate-spin' />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Submit application
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className='text-sm text-text-muted hover:text-text-heading transition-colors text-center'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-4'>
                {/* Score summary */}
                {skillGap && (
                  <div className='flex items-center gap-3 rounded-xl bg-bg p-3'>
                    <ScoreCircle score={skillGap.compatibilityScore} size={52} />
                    <div>
                      <p className='text-sm font-semibold text-text-heading'>
                        {skillGap.compatibilityScore}% match
                      </p>
                      <p className='text-xs text-text-muted'>
                        {skillGap.matchedSkills.length} of{' '}
                        {job.requiredSkills.length} skills matched
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowApplyForm(true)}
                  className='w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors'
                >
                  <Send size={15} />
                  Apply for this job
                </button>
              </div>
            )}
          </div>

          {/* Skill gap breakdown */}
          {skillGap && (
            <div className='rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4'>
              <h3 className='font-semibold text-text-heading'>
                Your skill gap
              </h3>

              {skillGap.matchedSkills.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-success uppercase tracking-wide mb-2'>
                    ✓ Skills you have ({skillGap.matchedSkills.length})
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {skillGap.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className='rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillGap.missingSkills.length > 0 && (
                <div>
                  <p className='text-xs font-semibold text-danger uppercase tracking-wide mb-2'>
                    ✗ Skills to develop ({skillGap.missingSkills.length})
                  </p>
                  <div className='flex flex-wrap gap-1.5'>
                    {skillGap.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className='rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skillGap.missingSkills.length === 0 && (
                <div className='flex items-center gap-2 rounded-xl bg-success/10 p-3'>
                  <CheckCircle2 size={18} className='text-success shrink-0' />
                  <p className='text-sm font-medium text-success'>
                    You have all required skills for this role
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Company info */}
          <div className='rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3'>
            <h3 className='font-semibold text-text-heading'>About the company</h3>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-sm text-primary'>
                {(job.companyName || 'C')[0].toUpperCase()}
              </div>
              <div>
                <p className='text-sm font-semibold text-text-heading'>
                  {job.companyName}
                </p>
                <p className='text-xs text-text-muted'>{job.companyIndustry}</p>
              </div>
            </div>

            {job.companyDescription && (
              <p className='text-sm text-text leading-relaxed'>
                {job.companyDescription}
              </p>
            )}

            {job.companyWebsite && (
              <a
                href={job.companyWebsite}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1.5 text-xs text-primary hover:underline'
              >
                <Globe size={12} />
                {job.companyWebsite}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
