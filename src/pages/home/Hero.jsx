import React from 'react';
import {motion }from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle2, GraduationCap } from 'lucide-react';

// ─── Animation variants ───────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const Hero = () => {
  return (
    <section className='relative overflow-hidden border-b border-border'>
      {/* Background grid decoration */}
      <div
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow blob */}
      <div className='pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary opacity-10 blur-3xl' />

      <div className='container relative py-24 md:py-32 text-center'>
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={0}
          className='mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5'
        >
          <span className='h-2 w-2 rounded-full bg-success animate-pulse' />
          <span className='text-xs font-medium text-text'>
            Smart recruitment powered by skill gap analysis
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={1}
          className='text-4xl sm:text-5xl md:text-6xl font-bold text-text-heading leading-tight tracking-tight'
        >
          Stop guessing. <span className='text-primary'>Start matching.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={2}
          className='mt-6 mx-auto max-w-2xl text-base sm:text-lg text-text leading-relaxed'
        >
          SkillBridge is a smart job portal that compares your skills against
          employer requirements, shows you exactly what is missing, and guides
          you on how to close the gap, before you even apply.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={3}
          className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-3'
        >
          <Link
            to='/register'
            className='flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors'
          >
            Get started for free
            <ArrowRight size={16} />
          </Link>
          <Link
            to='/login'
            className='flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-surface px-7 py-3 text-sm font-semibold text-text-heading hover:bg-border transition-colors'
          >
            Sign in to your account
          </Link>
        </motion.div>

        {/* Role indicators */}
        <motion.div
          variants={fadeUp}
          initial='hidden'
          animate='visible'
          custom={4}
          className='mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted'
        >
          <span className='flex items-center gap-2'>
            <GraduationCap size={16} className='text-primary' />
            For graduates
          </span>
          <span className='h-1 w-1 rounded-full bg-border' />
          <span className='flex items-center gap-2'>
            <Building2 size={16} className='text-secondary' />
            For employers
          </span>
          <span className='h-1 w-1 rounded-full bg-border' />
          <span className='flex items-center gap-2'>
            <CheckCircle2 size={16} className='text-success' />
            Free to use
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
