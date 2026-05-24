import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, X, Check, Loader2, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const fetchProfile = () =>
  api.get('/profile/employer').then((res) => res.data.profile)

const updateProfile = (data) =>
  api.patch('/profile/employer', data).then((res) => res.data)

const industries = [
  'Information Technology',
  'Banking and Finance',
  'Education',
  'Healthcare Administration',
  'Engineering and Technical Services',
  'Other',
]

const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+']

const Section = ({ title, children }) => (
  <div className='rounded-2xl border border-border bg-surface p-6'>
    <h2 className='font-semibold text-text-heading mb-4'>{title}</h2>
    {children}
  </div>
)

const EmployerProfile = () => {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [websiteError, setWebsiteError] = useState('')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['employer-profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['employer-profile'], data.profile)
      toast.success('Company profile updated')
      setEditing(false)
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const startEdit = () => {
    setFormData({
      companyName: profile?.companyName || '',
      industry: profile?.industry || '',
      companySize: profile?.companySize || '1-10',
      location: profile?.location || '',
      website: profile?.website || '',
      description: profile?.description || '',
    })
    setWebsiteError('')
    setEditing(true)
  }

  const handleSave = () => {
    // Validate website if provided
    if (
      formData.website &&
      !/^https?:\/\/.+/.test(formData.website)
    ) {
      setWebsiteError('Website must start with http:// or https://')
      return
    }
    setWebsiteError('')
    mutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 size={28} className='animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='flex w-full max-w-none flex-col gap-6'>

      {/* ── Header ── */}
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>Company Profile</h1>
        <p className='text-sm text-text-muted mt-1'>
          This information appears on all your job postings
        </p>
      </div>

      {/* ── Company Avatar + Name ── */}
      <div className='flex items-center gap-5 rounded-2xl border border-border bg-surface p-6'>
        <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-2xl font-bold text-secondary'>
          {profile?.companyName?.[0]?.toUpperCase() || (
            <Building2 size={28} className='text-secondary' />
          )}
        </div>
        <div>
          <p className='text-xl font-bold text-text-heading'>
            {profile?.companyName || 'Your Company'}
          </p>
          <p className='text-sm text-text-muted mt-0.5'>
            {profile?.industry || 'Industry not set'}
          </p>
          <p className='text-xs text-text-muted mt-0.5'>
            {profile?.user?.email}
          </p>
        </div>
      </div>

      {/* ── Company Details Section ── */}
      <Section title='Company Information'>
        {editing ? (
          // ── Edit mode ──
          <div className='flex flex-col gap-4'>
            {/* Company name */}
            <div>
              <label className='block text-xs font-medium text-text-muted mb-1'>
                Company name <span className='text-danger'>*</span>
              </label>
              <input
                type='text'
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                placeholder='e.g. Acme Technologies Ltd'
                className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all'
              />
            </div>

            {/* Industry + Company size */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              <div>
                <label className='block text-xs font-medium text-text-muted mb-1'>
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary transition-all'
                >
                  <option value=''>Select industry</option>
                  {industries.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-xs font-medium text-text-muted mb-1'>
                  Company size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      companySize: e.target.value,
                    }))
                  }
                  className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary transition-all'
                >
                  {companySizes.map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className='block text-xs font-medium text-text-muted mb-1'>
                Location
              </label>
              <input
                type='text'
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder='e.g. Lagos, Nigeria'
                className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all'
              />
            </div>

            {/* Website */}
            <div>
              <label className='block text-xs font-medium text-text-muted mb-1'>
                Website
              </label>
              <input
                type='text'
                value={formData.website}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                  setWebsiteError('')
                }}
                placeholder='https://yourcompany.com'
                className={`w-full rounded-lg border px-3 py-2 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all
                  ${websiteError ? 'border-danger bg-danger/5' : 'border-border bg-bg'}`}
              />
              {websiteError && (
                <p className='text-danger text-xs mt-1'>{websiteError}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className='block text-xs font-medium text-text-muted mb-1'>
                Company description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Briefly describe what your company does...'
                className='w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all resize-none'
              />
            </div>

            {/* Actions */}
            <div className='flex items-center gap-3 pt-1'>
              <button
                onClick={handleSave}
                disabled={mutation.isPending}
                className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors'
              >
                {mutation.isPending ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <Check size={14} />
                )}
                Save changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className='flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-heading hover:bg-border transition-colors'
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // ── View mode ──
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {[
                { label: 'Company name', value: profile?.companyName },
                { label: 'Industry', value: profile?.industry },
                { label: 'Company size', value: profile?.companySize ? `${profile.companySize} employees` : null },
                { label: 'Location', value: profile?.location },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className='text-xs font-medium text-text-muted'>{label}</p>
                  <p className='text-sm text-text-heading mt-0.5'>
                    {value || <span className='text-text-muted italic'>Not set</span>}
                  </p>
                </div>
              ))}
            </div>

            {profile?.website && (
              <div>
                <p className='text-xs font-medium text-text-muted'>Website</p>
                <a
                  href={profile.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-primary hover:underline'
                >
                  {profile.website}
                </a>
              </div>
            )}

            {profile?.description && (
              <div>
                <p className='text-xs font-medium text-text-muted'>Description</p>
                <p className='text-sm text-text leading-relaxed mt-0.5'>
                  {profile.description}
                </p>
              </div>
            )}

            <button
              onClick={startEdit}
              className='flex items-center gap-2 self-start rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-heading hover:bg-border transition-colors mt-1'
            >
              <Pencil size={14} />
              Edit profile
            </button>
          </div>
        )}
      </Section>

    </div>
  )
}

export default EmployerProfile
