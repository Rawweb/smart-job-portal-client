import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const CTA = () => {
  return (
    <section className='border-b border-border'>
      <div className='container py-20 md:py-24 text-center'>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='mx-auto max-w-2xl'
        >
          <div className='mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface'>
            <img
              src={logo}
              alt='SkillBridge'
              className='h-9 w-8 object-contain'
            />
          </div>
          <h2 className='text-3xl sm:text-4xl font-bold text-text-heading'>
            Ready to close your skill gap?
          </h2>
          <p className='mt-4 text-text'>
            Join graduates and employers already using SkillBridge to make
            smarter, faster, and more informed recruitment decisions.
          </p>

          <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3'>
            <Link
              to='/register'
              className='flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors'
            >
              Create a free account
              <ArrowRight size={16} />
            </Link>
            <Link
              to='/login'
              className='flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-surface px-8 py-3 text-sm font-semibold text-text-heading hover:bg-border transition-colors'
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
