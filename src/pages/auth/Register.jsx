import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

// Zod validation schema
const schema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
      });

      saveAuth(data.user, data.token);
      toast.success('Account created successfully!');
      navigate('/select-role');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    }
  };

  return (
    <div className='w-full'>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='mx-auto w-full max-w-md'
      >
        {/* Brand */}
        <div className='mb-6 text-center'>
          <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border'>
            <img src={logo} alt='Logo' className='w-9 h-8' />
          </div>
          <h1 className='text-2xl font-bold text-text-heading'>
            Create your account
          </h1>
          <p className='text-text-muted text-sm mt-1'>
            Start your journey to better employment
          </p>
        </div>

        {/* Card */}
        <div className='rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Email address
              </label>
              <input
                type='email'
                placeholder='you@example.com'
                {...register('email')}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm text-text placeholder:text-text-placeholder
                  outline-none transition-all duration-200
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${errors.email ? 'border-red-400 bg-red-50' : 'border-border bg-surface'}`}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1.5'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='At least 8 characters'
                  {...register('password')}
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm text-text placeholder:text-text-placeholder
                    outline-none transition-all duration-200
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.password ? 'border-red-400 bg-red-50' : 'border-border bg-surface'}`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text focus:outline-none'
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-xs mt-1.5'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-sm font-medium text-text mb-1.5'>
                Confirm password
              </label>
              <div className='relative'>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder='Repeat your password'
                  {...register('confirmPassword')}
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm text-text placeholder:text-text-placeholder
                    outline-none transition-all duration-200
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-border bg-surface'}`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm(!showConfirm)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text focus:outline-none'
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-500 text-xs mt-1.5'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='btn mt-2'
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className='mt-5 text-center text-sm text-text-muted'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-primary font-medium hover:underline'
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
