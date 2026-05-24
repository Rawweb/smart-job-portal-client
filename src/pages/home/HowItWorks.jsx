import React from 'react'
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const steps = [
  {
    number: '01',
    title: 'Create your profile',
    description:
      'Register, upload your resume, and add your skills. The system auto-extracts skills from your resume to get you started fast.',
    role: 'graduate',
  },
  {
    number: '02',
    title: 'Browse matched jobs',
    description:
      'Every job listing shows your compatibility score upfront. Filter by sector, type, and match level to find the right fit.',
    role: 'graduate',
  },
  {
    number: '03',
    title: 'See your skill gap',
    description:
      'Open any job and instantly see which required skills you already have and which ones you still need to develop.',
    role: 'graduate',
  },
  {
    number: '04',
    title: 'Apply and grow',
    description:
      'Apply directly through the platform. Follow the recommendations, improve your skills, and track your applications.',
    role: 'graduate',
  },
];

const HowItWorks = () => {
  return (
    <section id='how-it-works' className='border-b border-border bg-surface'>
      <div className='container py-20 md:py-24'>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='mb-14 text-center'
        >
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            How it works
          </span>
          <h2 className='mt-3 text-3xl sm:text-4xl font-bold text-text-heading'>
            From registration to your next job
          </h2>
          <p className='mt-4 mx-auto max-w-xl text-text'>
            Four simple steps that take you from signup to informed, targeted
            job applications.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {steps.map(({ number, title, description }, i) => (
            <motion.div
              key={number}
              variants={fadeUp}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              custom={i * 0.5}
              className='relative flex flex-col gap-4'
            >
              {/* Connector line between steps */}
              {i < steps.length - 1 && (
                <div className='hidden lg:block absolute top-5 left-full w-full h-px bg-border -translate-y-1/2 z-0' />
              )}

              {/* Step number */}
              <div className='relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-sm font-bold'>
                {number}
              </div>

              <div>
                <h3 className='font-semibold text-text-heading mb-1.5'>
                  {title}
                </h3>
                <p className='text-sm text-text leading-relaxed'>
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks