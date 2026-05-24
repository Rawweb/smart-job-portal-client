import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const roles = [
  {
    id: 'graduate',
    label: "I'm a Graduate",
    description: 'Looking for jobs that match my skills and building my career',
    icon: GraduationCap,
  },
  {
    id: 'employer',
    label: "I'm an Employer",
    description:
      'Hiring talent and finding candidates that fit our requirements',
    icon: Building2,
  },
];

const SelectRole = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected) {
      toast.error('Please select a role to continue');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/select-role', { role: selected });

      setUser(data.user);
      toast.success('Role selected!');

      navigate(
        selected === 'graduate'
          ? '/graduate/onboarding'
          : '/employer/onboarding'
      );
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
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
            <img src={logo} alt='SkillBridge Logo' className='w-9 h-8' />
          </div>
          <h1 className='text-2xl font-bold text-text-heading'>
            How will you use SkillBridge?
          </h1>
          <p className='text-text-muted text-sm mt-1'>
            Choose your role — you can only select this once
          </p>
        </div>

        {/* Role Cards */}
        <div className='flex flex-col gap-3 mb-5'>
          {roles.map(({ id, label, description, icon: Icon }) => {
            const isSelected = selected === id;

            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(id)}
                className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
                  ${
                    isSelected
                      ? 'border-primary bg-surface shadow-card'
                      : 'border-border bg-surface hover:border-primary/40'
                  }`}
              >
                {/* Selected check */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className='absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center'
                  >
                    <svg
                      className='w-3 h-3 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </motion.div>
                )}

                <div className='flex items-start gap-4'>
                  {/* Icon */}
                  <div
                    className={`shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200
                      ${isSelected ? 'bg-primary' : 'bg-border'}`}
                  >
                    <Icon
                      size={20}
                      className={isSelected ? 'text-white' : 'text-text-muted'}
                    />
                  </div>

                  {/* Text */}
                  <div className='min-w-0 pt-0.5'>
                    <h3
                      className={`font-semibold text-sm mb-0.5 transition-colors duration-200
                        ${isSelected ? 'text-primary' : 'text-text-heading'}`}
                    >
                      {label}
                    </h3>
                    <p className='text-text-muted text-sm leading-relaxed'>
                      {description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className='w-full flex items-center justify-center gap-2
            bg-primary hover:bg-primary-hover disabled:opacity-60
            text-white text-sm font-medium py-2.5 rounded-lg
            transition-colors duration-200'
        >
          {loading ? (
            <>
              <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              Setting up your account...
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default SelectRole;
