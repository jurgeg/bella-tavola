'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { RESTAURANT, IMAGES } from '@/lib/constants';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 px-6" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Our Story" title="A Taste of Italy" />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src={IMAGES.about}
              alt="Bella Tavola restaurant interior with warm candlelit ambiance"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/30 to-transparent" />
            {/* Decorative border */}
            <div className="absolute inset-4 border border-gold/20 pointer-events-none" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-serif text-3xl md:text-4xl text-cream font-light mb-6 leading-tight">
              Where Tradition<br />Meets Passion
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              {RESTAURANT.description}
            </p>
            <p className="text-text-muted leading-relaxed mb-8">
              Our wine list, personally curated by sommelier Lucia Marchetti, features over 120 labels
              from the finest vineyards across Tuscany, Piedmont, and Sicily. Every bottle tells a story,
              every glass an invitation to discover something new.
            </p>
            <div className="flex gap-12">
              <div>
                <span className="font-serif text-4xl text-gold">7</span>
                <p className="text-text-dim text-sm mt-1 tracking-wide uppercase">Years</p>
              </div>
              <div>
                <span className="font-serif text-4xl text-gold">120+</span>
                <p className="text-text-dim text-sm mt-1 tracking-wide uppercase">Wines</p>
              </div>
              <div>
                <span className="font-serif text-4xl text-gold">4.8</span>
                <p className="text-text-dim text-sm mt-1 tracking-wide uppercase">Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
