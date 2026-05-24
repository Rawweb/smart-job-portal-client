import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const ForEmployers = () => {
  return (
    <section className='border-b border-border bg-surface'>
      <div className='container py-20 md:py-24'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <motion.div
            variants={fadeUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
          >
            <span className='text-xs font-semibold uppercase tracking-widest text-secondary'>
              For employers
            </span>
            <h2 className='mt-3 text-3xl sm:text-4xl font-bold text-text-heading'>
              Hire faster with skill-matched candidates
            </h2>
            <p className='mt-4 text-text leading-relaxed'>
              Post jobs, define required skills, and let the system do the heavy
              lifting. Every applicant arrives with a compatibility score and a
              breakdown of their matched and missing skills, so you spend less
              time on manual screening.
            </p>

            <ul className='mt-8 flex flex-col gap-4'>
              {[
                'Post vacancies with defined skill requirements',
                'View applicant compatibility scores instantly',
                'See matched and missing skills per applicant',
                'Shortlist or reject with full context',
              ].map((point) => (
                <li
                  key={point}
                  className='flex items-start gap-3 text-sm text-text'
                >
                  <CheckCircle2
                    size={17}
                    className='mt-0.5 shrink-0 text-success'
                  />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              to='/register'
              className='mt-8 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary-hover transition-colors'
            >
              Register as an employer
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Decorative card mockup */}
          <motion.div
            variants={fadeUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            custom={1}
            className='rounded-2xl border border-border bg-bg p-6 flex flex-col gap-4'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-semibold text-text-heading'>
                  Frontend Developer
                </p>
                <p className='text-xs text-text-muted mt-0.5'>12 applicants</p>
              </div>
              <span className='rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success'>
                Active
              </span>
            </div>

            <div className='h-px bg-border' />

            {/* Applicant rows */}
            {[
              { name: 'Applicant A', score: 92, color: 'bg-success' },
              { name: 'Applicant B', score: 74, color: 'bg-warning' },
              { name: 'Applicant C', score: 51, color: 'bg-danger' },
            ].map(({ name, score, color }) => (
              <div key={name} className='flex items-center gap-3'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border text-xs font-semibold text-text-heading'>
                  {name[10]}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-medium text-text-heading'>
                      {name}
                    </span>
                    <span className='text-xs font-bold text-text-heading'>
                      {score}%
                    </span>
                  </div>
                  <div className='h-1.5 w-full rounded-full bg-border'>
                    <div
                      className={`h-1.5 rounded-full ${color}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForEmployers;
