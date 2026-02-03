'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { IMAGES } from '@/lib/constants';

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 md:py-32" aria-labelledby="gallery-heading">
      <div className="px-6 max-w-7xl mx-auto">
        <SectionHeading subtitle="La Galleria" title="Moments to Savour" />
      </div>

      {/* Horizontal scroll gallery */}
      <div className="overflow-x-auto scrollbar-hide px-6">
        <div className="flex gap-4 md:gap-6 pb-4 w-max">
          {IMAGES.gallery.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative flex-shrink-0 overflow-hidden group w-80 h-96 md:w-96 md:h-[28rem]"
            >
              <Image
                src={src}
                alt={`Bella Tavola gallery image ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 280px, 384px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-bg/20 group-hover:bg-bg/0 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
