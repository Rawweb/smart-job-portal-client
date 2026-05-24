import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Target, Users } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const stats = [
  { value: '5', label: 'Sectors covered', icon: Briefcase },
  { value: '100%', label: 'Skill-based matching', icon: Target },
  { value: '3', label: 'User roles supported', icon: Users },
];

const Stats = () => {
  return (
    <section className='border-b border-border bg-surface'>
      <div className='container py-12'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
          {stats.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              custom={i}
              className='flex flex-col items-center text-center gap-2'
            >
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10'>
                <Icon size={20} className='text-primary' />
              </div>
              <span className='text-3xl font-bold text-text-heading'>
                {value}
              </span>
              <span className='text-sm text-text-muted'>{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
