import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

const currentYear = new Date().getFullYear();

const schema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  qualification: z.enum(['OND', 'HND', 'BSc', 'MSc', 'PhD', 'Other']),
  graduationYear: z
    .string()
    .optional()
    .refine(
      (val) => !val || (Number(val) >= 1990 && Number(val) <= currentYear + 1),
      { message: `Enter a valid year between 1990 and ${currentYear + 1}` }
    ),
  about: z.string().optional(),
});

const StepDetails = ({ onSubmit, onBack, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { qualification: 'BSc' },
  });

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-xl font-bold text-text-heading'>
          Tell us about yourself
        </h2>
        <p className='text-sm text-text-muted mt-1'>
          This information will appear on your profile. You can update it later.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        {/* Full Name */}
        <div>
          <label className='block text-sm font-medium text-text mb-1.5'>
            Full name <span className='text-danger'>*</span>
          </label>
          <input
            type='text'
            placeholder='e.g. Kingsley Chibuikem'
            {...register('fullName')}
            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
              ${errors.fullName ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
          />
          {errors.fullName && (
            <p className='text-danger text-xs mt-1.5'>
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Two columns — phone + location */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Phone number
            </label>
            <input
              type='tel'
              placeholder='e.g. 08012345678'
              {...register('phone')}
              className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Location
            </label>
            <input
              type='text'
              placeholder='e.g. Lagos, Nigeria'
              {...register('location')}
              className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>
        </div>

        {/* Field of study */}
        <div>
          <label className='block text-sm font-medium text-text mb-1.5'>
            Field of study
          </label>
          <input
            type='text'
            placeholder='e.g. Computer Science'
            {...register('fieldOfStudy')}
            className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
          />
        </div>

        {/* Qualification + Graduation Year */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Highest qualification
            </label>
            <select
              {...register('qualification')}
              className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
            >
              {['OND', 'HND', 'BSc', 'MSc', 'PhD', 'Other'].map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-text mb-1.5'>
              Graduation year
            </label>
            <input
              type='number'
              placeholder={String(currentYear)}
              {...register('graduationYear')}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
                ${errors.graduationYear ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
            />
            {errors.graduationYear && (
              <p className='text-danger text-xs mt-1.5'>
                {errors.graduationYear.message}
              </p>
            )}
          </div>
        </div>

        {/* About */}
        <div>
          <label className='block text-sm font-medium text-text mb-1.5'>
            Short bio{' '}
            <span className='text-text-muted font-normal'>(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder='A brief description about yourself and your career goals...'
            {...register('about')}
            className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
          />
        </div>

        {/* Actions */}
        <div className='flex items-center justify-between pt-2 border-t border-border'>
          <button
            type='button'
            onClick={onBack}
            className='flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-heading transition-colors'
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type='submit'
            disabled={isSubmitting}
            className='flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors'
          >
            {isSubmitting ? (
              <>
                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Setting up your account...
              </>
            ) : (
              'Complete setup'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepDetails;
