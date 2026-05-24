import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Brain, Target, TrendingUp, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};


const features = [
  {
    icon: Brain,
    title: 'Skill Gap Analysis',
    description:
      'Your skills are compared directly against every job requirement. See exactly what you have and what you are missing before you apply.',
  },
  {
    icon: Target,
    title: 'Compatibility Scoring',
    description:
      'Every job shows a match percentage calculated from your profile. Know your suitability at a glance without guessing.',
  },
  {
    icon: TrendingUp,
    title: 'Improvement Recommendations',
    description:
      'Missing a skill? The system tells you exactly what to learn and categorises it as technical or soft skill so you can act fast.',
  },
  {
    icon: Zap,
    title: 'Smart Job Matching',
    description:
      'Jobs are ranked by compatibility with your skill profile, not just by date posted. The best matches rise to the top.',
  },
  {
    icon: BarChart3,
    title: 'Application Tracking',
    description:
      'Track every application in one place. See status updates from employers in real time without chasing emails.',
  },
  {
    icon: BookOpen,
    title: 'Sector-Focused',
    description:
      'Built around five core sectors; IT, Banking, Education, Healthcare, and Engineering, with skill sets tailored to each.',
  },
];


const Features = () => {
  return (
    <section id='features' className='border-b border-border'>
      <div className='container py-20 md:py-24'>
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='mb-14 text-center'
        >
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            Features
          </span>
          <h2 className='mt-3 text-3xl sm:text-4xl font-bold text-text-heading'>
            Everything you need to land the right job
          </h2>
          <p className='mt-4 mx-auto max-w-xl text-text'>
            Built specifically for graduates entering the workforce and not just
            another job board.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              custom={i * 0.5}
              className='rounded-2xl border border-border bg-surface p-6 hover:border-primary/40 transition-colors duration-200'
            >
              <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10'>
                <Icon size={20} className='text-primary' />
              </div>
              <h3 className='mb-2 font-semibold text-text-heading'>{title}</h3>
              <p className='text-sm text-text leading-relaxed'>{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
