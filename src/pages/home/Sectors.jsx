import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const sectors = [
  'Information Technology',
  'Banking & Finance',
  'Education',
  'Healthcare Administration',
  'Engineering & Technical Services',
];

const Sectors = () => {
  return (
    <section id='sectors' className='border-b border-border'>
      <div className='container py-20 md:py-24'>
        <motion.div
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='mb-12 text-center'
        >
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            Sectors
          </span>
          <h2 className='mt-3 text-3xl sm:text-4xl font-bold text-text-heading'>
            Built for five core industries
          </h2>
          <p className='mt-4 mx-auto max-w-xl text-text'>
            Skill requirements are tailored per sector so the gap analysis
            reflects what employers in that field actually demand.
          </p>
        </motion.div>

        <div className='flex flex-wrap justify-center gap-3'>
          {sectors.map((sector, i) => (
            <motion.div
              key={sector}
              variants={fadeUp}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              custom={i * 0.3}
              className='flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text-heading'
            >
              <CheckCircle2 size={15} className='text-success shrink-0' />
              {sector}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sectors;
