'use client';

import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { RESTAURANT } from '@/lib/constants';

export default function LocationHours() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Trovarci" title="Location & Hours" />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square md:aspect-[4/3] bg-bg-card border border-border overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gold/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-text-dim text-sm">Google Maps Embed</p>
                <p className="text-text-dim text-xs mt-1">(Add API key for live map)</p>
              </div>
            </div>
            {/* Decorative border */}
            <div className="absolute inset-3 border border-gold/10 pointer-events-none" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {/* Address */}
            <div className="mb-10">
              <h3 className="font-serif text-2xl text-cream mb-3">Find Us</h3>
              <p className="text-text-muted leading-relaxed">{RESTAURANT.address}</p>
              <a
                href={`tel:${RESTAURANT.phone}`}
                className="text-gold hover:text-gold-light transition-colors mt-2 inline-block"
              >
                {RESTAURANT.phone}
              </a>
              <br />
              <a
                href={`mailto:${RESTAURANT.email}`}
                className="text-gold hover:text-gold-light transition-colors mt-1 inline-block"
              >
                {RESTAURANT.email}
              </a>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-serif text-2xl text-cream mb-4">Opening Hours</h3>
              <dl className="space-y-3">
                {Object.entries(RESTAURANT.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center border-b border-border pb-3 last:border-0">
                    <dt className="text-text-muted text-sm tracking-wide">{day}</dt>
                    <dd className={`text-sm tracking-wide ${hours === 'Closed' ? 'text-wine-light' : 'text-cream'}`}>
                      {hours}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
