'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { IMAGES } from '@/lib/constants';

export default function ReservationCTA() {
  return (
    <section className="relative py-32 md:py-40 px-6 overflow-hidden" aria-label="Reservation call to action">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${IMAGES.ctaBg})` }}
      />
      <div className="absolute inset-0 bg-bg/80" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative text-center max-w-2xl mx-auto"
      >
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">
          La Prenotazione
        </p>
        <h2 className="font-serif text-4xl md:text-6xl text-cream font-light mb-6 leading-tight">
          Your Table<br />Awaits
        </h2>
        <p className="text-text-muted mb-10 leading-relaxed">
          Whether it&apos;s a romantic dinner for two or a celebration with family and friends,
          we&apos;d love to welcome you. Book your table in just a few clicks.
        </p>
        <Link
          href="/book"
          className="inline-block px-12 py-4 bg-gold text-bg font-medium tracking-widest uppercase text-sm transition-all duration-500 hover:bg-gold-light hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]"
        >
          Reserve Now
        </Link>
      </motion.div>
    </section>
  );
}
