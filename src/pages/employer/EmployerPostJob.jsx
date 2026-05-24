import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { skillCategories } from '../../data/skills';

const schema = z.object({
  title: z.string().min(3, 'Job title is required'),
  description: z.string().min(30, 'Please write at least 30 characters'),
  sector: z.string().min(1, 'Please select a sector'),
  location: z.string().optional(),
  jobType: z.string().min(1, 'Please select a job type'),
  experienceLevel: z.string().min(1, 'Please select experience level'),
  requiredQualification: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  isNegotiable: z.boolean().optional(),
});

const sectors = [
  'Information Technology',
  'Banking and Finance',
  'Education',
  'Healthcare Administration',
  'Engineering and Technical Services',
  'Other',
];

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Required skills is managed as its own state
  // because it is a dynamic list not a simple form field
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');

  const toggleSkill = (skill) => {
    setRequiredSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filteredCategories = skillCategories
    .map((cat) => ({
      ...cat,
      skills: cat.skills.filter((s) =>
        s.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    }))
    .filter((cat) => cat.skills.length > 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jobType: 'Full-time',
      experienceLevel: 'Entry Level',
      requiredQualification: 'Any',
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => api.post('/jobs', payload),
    onSuccess: () => {
      toast.success('Job posted successfully!');
      // Invalidate employer stats so the dashboard refreshes
      queryClient.invalidateQueries({ queryKey: ['employer-stats'] });
      navigate('/employer/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post job');
    },
  });

  const onSubmit = (formData) => {
    if (requiredSkills.length === 0) {
      toast.error('Add at least one required skill');
      return;
    }

    mutation.mutate({
      title: formData.title,
      description: formData.description,
      sector: formData.sector,
      location: formData.location || '',
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      requiredQualification: formData.requiredQualification || 'Any',
      requiredSkills,
      salary: {
        min: formData.salaryMin ? Number(formData.salaryMin) : null,
        max: formData.salaryMax ? Number(formData.salaryMax) : null,
        currency: 'NGN',
        isNegotiable: formData.isNegotiable || false,
      },
    });
  };

  return (
    <div className='flex w-full max-w-none flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-bold text-text-heading'>Post a Job</h1>
        <p className='text-sm text-text-muted mt-1'>
          Fill in the details and define the required skills for skill gap
          analysis
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        {/* ── Basic info ── */}
        <div className='rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5'>
          <h2 className='font-semibold text-text-heading'>Basic Information</h2>

          {/* Title */}
          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Job title <span className='text-danger'>*</span>
            </label>
            <input
              type='text'
              placeholder='e.g. Frontend Developer'
              {...register('title')}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
                ${errors.title ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
            />
            {errors.title && (
              <p className='text-danger text-xs mt-1.5'>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Sector + Job Type */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Sector <span className='text-danger'>*</span>
              </label>
              <select
                {...register('sector')}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.sector ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
              >
                <option value=''>Select sector</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.sector && (
                <p className='text-danger text-xs mt-1.5'>
                  {errors.sector.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Job type
              </label>
              <select
                {...register('jobType')}
                className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
              >
                {[
                  'Full-time',
                  'Part-time',
                  'Contract',
                  'Internship',
                  'Remote',
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience + Qualification */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Experience level
              </label>
              <select
                {...register('experienceLevel')}
                className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
              >
                {['Entry Level', 'Mid Level', 'Senior Level'].map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Required qualification
              </label>
              <select
                {...register('requiredQualification')}
                className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
              >
                {['Any', 'OND', 'HND', 'BSc', 'MSc', 'PhD'].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Location
            </label>
            <input
              type='text'
              placeholder='e.g. Lagos, Nigeria or Remote'
              {...register('location')}
              className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Job description <span className='text-danger'>*</span>
            </label>
            <textarea
              rows={5}
              placeholder='Describe the role, responsibilities, and what you are looking for...'
              {...register('description')}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent resize-none
                ${errors.description ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
            />
            {errors.description && (
              <p className='text-danger text-xs mt-1.5'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Salary range (NGN){' '}
              <span className='text-text-muted font-normal'>(optional)</span>
            </label>
            <div className='flex items-center gap-3'>
              <input
                type='number'
                placeholder='Min e.g. 150000'
                {...register('salaryMin')}
                className='flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
              />
              <span className='text-text-muted text-sm shrink-0'>to</span>
              <input
                type='number'
                placeholder='Max e.g. 300000'
                {...register('salaryMax')}
                className='flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>
            <label className='flex items-center gap-2 mt-2 cursor-pointer'>
              <input
                type='checkbox'
                {...register('isNegotiable')}
                className='rounded border-border accent-primary'
              />
              <span className='text-xs text-text-muted'>
                Salary is negotiable
              </span>
            </label>
          </div>
        </div>

        {/* ── Required Skills ── */}
        <div className='rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4'>
          <div>
            <h2 className='font-semibold text-text-heading'>Required Skills</h2>
            <p className='text-sm text-text-muted mt-0.5'>
              These skills are used for skill gap analysis — choose carefully
            </p>
          </div>

          {/* Selected skills */}
          {requiredSkills.length > 0 && (
            <div>
              <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-2'>
                Selected ({requiredSkills.length})
              </p>
              <div className='flex flex-wrap gap-2'>
                {requiredSkills.map((skill) => (
                  <button
                    key={skill}
                    type='button'
                    onClick={() => toggleSkill(skill)}
                    className='flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary-hover transition-colors'
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
            <Search
              size={15}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted'
            />
            <input
              type='text'
              placeholder='Search skills to add...'
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              className='w-full rounded-lg border border-border bg-bg pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
            />
          </div>

          {/* Skill list */}
          <div className='skill-scrollbar max-h-60 overflow-y-auto flex flex-col gap-4 pr-2'>
            {filteredCategories.map(({ category, skills }) => (
              <div key={category}>
                <p className='text-xs font-semibold text-text-muted uppercase tracking-wide mb-2'>
                  {category}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {skills.map((skill) => {
                    const isSelected = requiredSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type='button'
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150
                          ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-border bg-surface text-text hover:border-primary/50'
                          }`}
                      >
                        {!isSelected && <Plus size={11} />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Submit ── */}
        <div className='flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={() => navigate('/employer/dashboard')}
            className='rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-heading hover:bg-border transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={mutation.isPending}
            className='flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors'
          >
            {mutation.isPending ? (
              <>
                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Posting...
              </>
            ) : (
              'Post job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployerPostJob;
