import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(1, 'Please select an industry'),
  companySize: z.string().min(1, 'Please select company size'),
  location: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Website must start with http:// or https://',
    }),
  description: z.string().optional(),
});

const industries = [
  'Information Technology',
  'Banking and Finance',
  'Education',
  'Healthcare Administration',
  'Engineering and Technical Services',
  'Other',
];

const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

const EmployerOnboarding = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { industry: '', companySize: '1-10' },
  });

  const onSubmit = async (formData) => {
    try {
      await api.post('/onboarding/employer', formData);

      setUser((prev) => ({ ...prev, isOnboarded: true }));

      toast.success('Company profile set up — welcome to SkillBridge!');
      navigate('/employer/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
  };

  return (
    <div className='min-h-screen bg-bg flex flex-col'>
      {/* Top bar */}
      <header className='flex h-16 items-center border-b border-border bg-surface px-6'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
            <img
              src={logo}
              alt='SkillBridge'
              className='h-5 w-5 object-contain'
            />
          </div>
          <span className='font-bold text-sm text-text-heading'>
            SkillBridge
          </span>
        </div>
      </header>

      {/* Content */}
      <div className='flex flex-1 flex-col items-center justify-start px-4 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='w-full max-w-lg'
        >
          {/* Header */}
          <div className='mb-8 text-center'>
            <h1 className='text-2xl font-bold text-text-heading'>
              Set up your company profile
            </h1>
            <p className='text-sm text-text-muted mt-1'>
              This information will be shown to graduates on your job postings
            </p>
          </div>

          {/* Card */}
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-5'
            >
              {/* Company Name */}
              <div>
                <label className='block text-sm font-medium text-text mb-1.5'>
                  Company name <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='e.g. Acme Technologies Ltd'
                  {...register('companyName')}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.companyName ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
                />
                {errors.companyName && (
                  <p className='text-danger text-xs mt-1.5'>
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              {/* Industry + Size */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-text mb-1.5'>
                    Industry <span className='text-danger'>*</span>
                  </label>
                  <select
                    {...register('industry')}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
                      ${errors.industry ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
                  >
                    <option value=''>Select industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className='text-danger text-xs mt-1.5'>
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-text mb-1.5'>
                    Company size
                  </label>
                  <select
                    {...register('companySize')}
                    className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
                  >
                    {companySizes.map((size) => (
                      <option key={size} value={size}>
                        {size} employees
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className='block text-sm font-medium text-text mb-1.5'>
                  Location <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='e.g. Lagos, Nigeria'
                  {...register('location')}
                  className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent'
                />
              </div>

              {/* Website */}
              <div>
                <label className='block text-sm font-medium text-text mb-1.5'>
                  Website{' '}
                  <span className='text-text-muted font-normal'>
                    (optional)
                  </span>
                </label>
                <input
                  type='text'
                  placeholder='https://yourcompany.com'
                  {...register('website')}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.website ? 'border-danger bg-danger/5' : 'border-border bg-surface'}`}
                />
                {errors.website && (
                  <p className='text-danger text-xs mt-1.5'>
                    {errors.website.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium text-text mb-1.5'>
                  Company description <span className='text-danger'>*</span>
                  <span className='text-text-muted font-normal' />
                </label>
                <textarea
                  rows={3}
                  placeholder='Brief description of what your company does...'
                  {...register('description')}
                  className='w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder outline-none transition-all focus:ring-2 focus:ring-primary focus:border-transparent resize-none'
                />
              </div>

              {/* Submit */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors mt-2'
              >
                {isSubmitting ? (
                  <>
                    <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Setting up your profile...
                  </>
                ) : (
                  'Complete setup'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployerOnboarding;
