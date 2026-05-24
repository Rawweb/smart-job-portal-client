import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StepResume from './StepResume';
import StepSkills from './StepSkills';
import StepDetails from './StepDetails';


const STEPS = [
  { number: 1, label: 'Resume' },
  { number: 2, label: 'Skills' },
  { number: 3, label: 'Details' },
];

// ─── Progress indicator ───────────────────
const ProgressBar = ({ currentStep }) => (
  <div className='flex items-center gap-0'>
    {STEPS.map((step, i) => {
      const isCompleted = currentStep > step.number;
      const isActive = currentStep === step.number;

      return (
        <div key={step.number} className='flex items-center'>
          {/* Step circle */}
          <div className='flex flex-col items-center gap-1.5'>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300
                ${
                  isCompleted
                    ? 'border-primary bg-primary text-white'
                    : isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface text-text-muted'
                }`}
            >
              {isCompleted ? <CheckCircle2 size={16} /> : step.number}
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                isActive
                  ? 'text-primary'
                  : isCompleted
                    ? 'text-text'
                    : 'text-text-muted'
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connecting line */}
          {i < STEPS.length - 1 && (
            <div
              className={`mb-5 h-px w-16 sm:w-24 transition-colors duration-300 ${
                currentStep > step.number ? 'bg-primary' : 'bg-border'
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────
const GraduateOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Step 1 handlers
  const handleResumeNext = () => setCurrentStep(2);
  const handleResumeSkip = () => {
    setExtractedSkills([]);
    setCurrentStep(2);
  };

  // Step 2 handler — receives final selected skills from StepSkills
  const handleSkillsNext = (skills) => {
    setSelectedSkills(skills);
    setCurrentStep(3);
  };

  // Step 3 handler — receives form data, calls API
  const handleDetailsSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      await api.post('/onboarding/graduate', {
        ...formData,
        skills: selectedSkills,
      });

      // Update user in context so isOnboarded becomes true
      setUser((prev) => ({ ...prev, isOnboarded: true }));

      toast.success('Profile set up — welcome to SkillBridge!');
      navigate('/graduate/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-bg flex flex-col'>
      {/* Top bar */}
      <header className='flex h-16 items-center justify-between border-b border-border bg-surface px-6'>
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
        <span className='text-xs text-text-muted font-medium'>
          Step {currentStep} of {STEPS.length}
        </span>
      </header>

      {/* Content */}
      <div className='flex flex-1 flex-col items-center justify-start px-4 py-10'>
        {/* Progress */}
        <div className='mb-10'>
          <ProgressBar currentStep={currentStep} />
        </div>

        {/* Step card */}
        <div className='w-full max-w-lg'>
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 && (
                  <StepResume
                    onNext={handleResumeNext}
                    onSkip={handleResumeSkip}
                    setExtractedSkills={setExtractedSkills}
                  />
                )}

                {currentStep === 2 && (
                  <StepSkills
                    extractedSkills={extractedSkills}
                    onNext={handleSkillsNext}
                    onBack={() => setCurrentStep(1)}
                  />
                )}

                {currentStep === 3 && (
                  <StepDetails
                    onSubmit={handleDetailsSubmit}
                    onBack={() => setCurrentStep(2)}
                    isSubmitting={isSubmitting}
                  />
                )} 
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraduateOnboarding;
