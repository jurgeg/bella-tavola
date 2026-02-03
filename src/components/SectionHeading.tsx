'use client';

import { motion } from 'framer-motion';

type Props = {
  subtitle?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({ subtitle, title, description }: Props) {
  return (
    <div className="text-center mb-16 md:mb-20">
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-gold tracking-[0.3em] uppercase text-xs mb-4"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-cream"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-text-muted max-w-xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-6 mx-auto w-16 h-[1px] bg-gold"
      />
    </div>
  );
}
