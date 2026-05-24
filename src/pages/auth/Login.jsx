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

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      const { data } = await api.post('/auth/login', formData);

      saveAuth(data.user, data.token);
      toast.success('Welcome back!');

      // Redirect based on role and onboarding status
      if (!data.user.role) {
        navigate('/select-role');
      } else if (!data.user.isOnboarded) {
        navigate(
          data.user.role === 'graduate' ? '/onboarding' : '/employer/onboarding'
        );
      } else {
        navigate(
          data.user.role === 'graduate' ? '/dashboard' : '/employer/dashboard'
        );
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className='min-h-screen bg-bg flex items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-md'
      >
        {/* Brand */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 border border-border rounded-xl mb-4'>
            <img src={logo} alt='SkillBridge Logo' className='w-8 h-8 object-contain' />
          </div>
          <h1 className='text-2xl font-bold text-text-heading'>Welcome back</h1>
          <p className='text-text-muted text-sm mt-1'>Sign in to your account</p>
        </div>

        {/* Card */}
        <div className='bg-surface rounded-2xl shadow-card border border-border p-8'>
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
                  ${errors.email ? 'border-danger bg-red-50' : 'border-border bg-surface'}`}
              />
              {errors.email && (
                <p className='text-danger text-xs mt-1.5'>
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
                  placeholder='Your password'
                  {...register('password')}
                  className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm text-text placeholder:text-text-placeholder
                    outline-none transition-all duration-200
                    focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.password ? 'border-danger bg-red-50' : 'border-border bg-surface'}`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text'
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-danger text-xs mt-1.5'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-primary hover:bg-primary-hover disabled:opacity-60
                text-white text-sm font-medium py-2.5 rounded-lg
                transition-colors duration-200 mt-2'
            >
              {isSubmitting ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className='text-center text-sm text-text-muted mt-6'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='text-primary font-medium hover:underline'
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
