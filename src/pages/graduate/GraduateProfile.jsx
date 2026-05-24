import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import {
  Pencil,
  X,
  Check,
  Loader2,
  UploadCloud,
  FileText,
  Plus,
  Search,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { skillCategories } from '../../data/skills'

// Fetch and mutation functions
const fetchProfile = () =>
  api.get('/profile/graduate').then((res) => res.data.profile)

const updateProfile = (data) =>
  api.patch('/profile/graduate', data).then((res) => res.data)

const updateResume = (formData) =>
  api.patch('/profile/graduate/resume', formData).then((res) => res.data)

const getResumeMimeType = (fileName = '') => {
  const lowerName = fileName.toLowerCase()
  if (lowerName.endsWith('.pdf')) return 'application/pdf'
  if (lowerName.endsWith('.doc')) return 'application/msword'
  return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

// Section wrapper — consistent card style
const Section = ({ title, children }) => (
  <div className='rounded-2xl border border-border bg-surface p-6'>
    <h2 className='font-semibold text-text-heading mb-4'>{title}</h2>
    {children}
  </div>
)

// Main Component
const GraduateProfile = () => {
  const queryClient = useQueryClient()

  // Which section is currently being edited
  // null means nothing is in edit mode
  // 'details' means the personal info section is open for editing
  // 'skills' means the skills section is open
  const [editing, setEditing] = useState(null)

  const [formData, setFormData] = useState({})
  const [selectedSkills, setSelectedSkills] = useState([])
  const [skillSearch, setSkillSearch] = useState('')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['graduate-profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  // Profile update mutation
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Update the cached profile with the response
      // so the UI reflects the new values without a full refetch
      queryClient.setQueryData(['graduate-profile'], data.profile)
      queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job'] })
      toast.success('Profile updated')
      setEditing(null)
    },
    onError: () => toast.error('Failed to update profile'),
  })

  // Resume update mutation
  const resumeMutation = useMutation({
    mutationFn: updateResume,
    onSuccess: (data) => {
      queryClient.setQueryData(['graduate-profile'], data.profile)
      const count = data.extractedSkills?.length || 0
      toast.success(
        count > 0
          ? `Resume updated — ${count} skills detected`
          : 'Resume updated'
      )
    },
    onError: () => toast.error('Failed to update resume'),
  })

  // Start editing a section — pre-fill form with current values
  const startEdit = (section) => {
    if (section === 'details') {
      setFormData({
        fullName: profile?.fullName || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        fieldOfStudy: profile?.fieldOfStudy || '',
        qualification: profile?.qualification || 'BSc',
        graduationYear: profile?.graduationYear || '',
        about: profile?.about || '',
      })
    }
    if (section === 'skills') {
      setSelectedSkills(profile?.skills || [])
      setSkillSearch('')
    }
    setEditing(section)
  }

  const cancelEdit = () => {
    setEditing(null)
    setFormData({})
  }

  const saveDetails = () => {
    updateMutation.mutate(formData)
  }

  const saveSkills = () => {
    if (selectedSkills.length === 0) {
      toast.error('Add at least one skill')
      return
    }
    updateMutation.mutate({ skills: selectedSkills })
  }

  const viewResume = async () => {
    if (!profile?.resume?.filePath) return

    try {
      const response = await fetch(profile.resume.filePath)
      if (!response.ok) throw new Error('Resume could not be opened')

      const rawBlob = await response.blob()
      const blob = new Blob([rawBlob], {
        type: getResumeMimeType(profile.resume.fileName),
      })
      const objectUrl = URL.createObjectURL(blob)

      if (profile.resume.fileName?.toLowerCase().endsWith('.pdf')) {
        const tab = window.open(objectUrl, '_blank', 'noopener,noreferrer')
        if (!tab) {
          const link = document.createElement('a')
          link.href = objectUrl
          link.download = profile.resume.fileName
          link.click()
        }
      } else {
        const link = document.createElement('a')
        link.href = objectUrl
        link.download = profile.resume.fileName || 'resume.docx'
        link.click()
      }

      setTimeout(() => URL.revokeObjectURL(objectUrl), 60 * 1000)
    } catch {
      window.open(profile.resume.filePath, '_blank', 'noopener,noreferrer')
    }
  }

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    )
  }

  // Dropzone for resume upload on the profile page
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error('Only PDF or DOCX files under 5MB are accepted')
        return
      }
      const file = acceptedFiles[0]
      if (!file) return

      const fd = new FormData()
      fd.append('resume', file)
      resumeMutation.mutate(fd)
    },
  })

  const filteredCategories = skillCategories
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) =>
        s.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    }))
    .filter((cat) => cat.skills.length > 0)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 size={28} className='animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='flex w-full max-w-none flex-col gap-6'>

      {/* ── Page header ── */}
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>My Profile</h1>
        <p className='text-sm text-text-muted mt-1'>
          Keep your profile updated to improve your job matches
        </p>
      </div>

      {/* ── Personal Details Section ── */}
      <Section title='Personal Details'>
        {editing === 'details' ? (
          // ── Edit mode ──
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {[
                { label: 'Full name', key: 'fullName', placeholder: 'Kingsley Chibuikem' },
                { label: 'Phone', key: 'phone', placeholder: '08012345678' },
                { label: 'Location', key: 'location', placeholder: 'Lagos, Nigeria' },
                { label: 'Field of study', key: 'fieldOfStudy', placeholder: 'Computer Science' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className='block text-xs font-medium text-text-muted mb-1'>
                    {label}
                  </label>
                  <input
                    type='text'
                    placeholder={placeholder}
                    value={formData[key] || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
                  />
                </div>
              ))}

              {/* Qualification */}
              <div>
                <label className='block text-xs font-medium text-text-muted mb-1'>
                  Qualification
                </label>
                <select
                  value={formData.qualification || 'BSc'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      qualification: e.target.value,
                    }))
                  }
                  className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary transition-all'
                >
                  {['OND', 'HND', 'BSc', 'MSc', 'PhD', 'Other'].map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* Graduation year */}
              <div>
                <label className='block text-xs font-medium text-text-muted mb-1'>
                  Graduation year
                </label>
                <input
                  type='number'
                  placeholder={String(new Date().getFullYear())}
                  value={formData.graduationYear || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      graduationYear: e.target.value,
                    }))
                  }
                  className='w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all'
                />
              </div>
            </div>

            {/* About */}
            <div>
              <label className='block text-xs font-medium text-text-muted mb-1'>
                About
              </label>
              <textarea
                rows={3}
                placeholder='A short bio about yourself...'
                value={formData.about || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about: e.target.value }))
                }
                className='w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all resize-none'
              />
            </div>

            {/* Action buttons */}
            <div className='flex items-center gap-3 pt-1'>
              <button
                onClick={saveDetails}
                disabled={updateMutation.isPending}
                className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors'
              >
                {updateMutation.isPending ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <Check size={14} />
                )}
                Save changes
              </button>
              <button
                onClick={cancelEdit}
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
                { label: 'Full name', value: profile?.fullName },
                { label: 'Email', value: profile?.user?.email },
                { label: 'Phone', value: profile?.phone },
                { label: 'Location', value: profile?.location },
                { label: 'Field of study', value: profile?.fieldOfStudy },
                {
                  label: 'Qualification',
                  value: profile?.qualification
                    ? `${profile.qualification}${profile.graduationYear ? ` · ${profile.graduationYear}` : ''}`
                    : null,
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className='text-xs font-medium text-text-muted'>{label}</p>
                  <p className='text-sm text-text-heading mt-0.5'>
                    {value || (
                      <span className='text-text-muted italic'>Not set</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {profile?.about && (
              <div>
                <p className='text-xs font-medium text-text-muted'>About</p>
                <p className='text-sm text-text leading-relaxed mt-0.5'>
                  {profile.about}
                </p>
              </div>
            )}

            <button
              onClick={() => startEdit('details')}
              className='flex items-center gap-2 self-start rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-heading hover:bg-border transition-colors mt-1'
            >
              <Pencil size={14} />
              Edit details
            </button>
          </div>
        )}
      </Section>

      {/* ── Skills Section ── */}
      <Section title='Skills'>
        {editing === 'skills' ? (
          <div className='flex flex-col gap-4'>
            {/* Current selections */}
            {selectedSkills.length > 0 && (
              <div>
                <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-2'>
                  Selected ({selectedSkills.length})
                </p>
                <div className='flex flex-wrap gap-2'>
                  {selectedSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className='flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors'
                    >
                      {skill}
                      <X size={11} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className='relative'>
              <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-text-muted' />
              <input
                type='text'
                placeholder='Search skills...'
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className='w-full rounded-lg border border-border bg-bg pl-9 pr-4 py-2 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary transition-all'
              />
            </div>

            {/* Skill categories */}
            <div className='max-h-64 overflow-y-auto flex flex-col gap-4 pr-1'>
              {filteredCategories.map(({ category, skills }) => (
                <div key={category}>
                  <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-2'>
                    {category}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {skills.map((skill) => {
                      const isSelected = selectedSkills.includes(skill)
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-all
                            ${isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-border bg-surface text-text hover:border-primary/50'
                            }`}
                        >
                          {!isSelected && <Plus size={10} />}
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className='flex items-center gap-3 pt-1 border-t border-border'>
              <button
                onClick={saveSkills}
                disabled={updateMutation.isPending}
                className='flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors'
              >
                {updateMutation.isPending ? (
                  <Loader2 size={14} className='animate-spin' />
                ) : (
                  <Check size={14} />
                )}
                Save skills
              </button>
              <button
                onClick={cancelEdit}
                className='flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-heading hover:bg-border transition-colors'
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View mode
          <div className='flex flex-col gap-4'>
            {profile?.skills?.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className='text-sm text-text-muted italic'>No skills added yet</p>
            )}

            <button
              onClick={() => startEdit('skills')}
              className='flex items-center gap-2 self-start rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-heading hover:bg-border transition-colors'
            >
              <Pencil size={14} />
              Edit skills
            </button>
          </div>
        )}
      </Section>

      {/* ── Resume Section ── */}
      <Section title='Resume'>
        <div className='flex flex-col gap-4'>

          {/* Current resume */}
          {profile?.resume?.fileName ? (
            <div className='flex items-center gap-4 rounded-xl border border-border bg-bg p-4'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10'>
                <FileText size={20} className='text-success' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-text-heading truncate'>
                  {profile.resume.fileName}
                </p>
                <p className='text-xs text-text-muted mt-0.5'>
                  Uploaded{' '}
                  {new Date(profile.resume.uploadedAt).toLocaleDateString(
                    'en-GB',
                    { day: 'numeric', month: 'short', year: 'numeric' }
                  )}
                </p>
              </div>
              {profile.resume.filePath && (
                <button
                  type='button'
                  onClick={viewResume}
                  className='text-xs font-medium text-primary hover:underline shrink-0'
                >
                  View
                </button>
              )}
            </div>
          ) : (
            <p className='text-sm text-text-muted italic'>No resume uploaded yet</p>
          )}

          {/* Drop zone for updating resume */}
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer
              ${isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
              }
              ${resumeMutation.isPending ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10'>
              <UploadCloud size={20} className='text-primary' />
            </div>
            {resumeMutation.isPending ? (
              <div className='flex items-center gap-2 text-sm text-text-muted'>
                <Loader2 size={14} className='animate-spin' />
                Uploading resume...
              </div>
            ) : (
              <div>
                <p className='text-sm font-medium text-text-heading'>
                  {profile?.resume?.fileName
                    ? 'Drop a new resume to replace the current one'
                    : 'Drop your resume here or click to browse'}
                </p>
                <p className='text-xs text-text-muted mt-1'>PDF or DOCX · Max 5MB</p>
              </div>
            )}
          </div>
        </div>
      </Section>

    </div>
  )
}

export default GraduateProfile
