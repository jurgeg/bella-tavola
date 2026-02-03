'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { supabase, Testimonial } from '@/lib/supabase';
import { FALLBACK_TESTIMONIALS } from '@/lib/constants';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error || !data || data.length === 0) {
          setTestimonials(FALLBACK_TESTIMONIALS);
        } else {
          setTestimonials(data);
        }
      } catch {
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="skeleton h-8 w-48 mx-auto mb-6" />
          <div className="skeleton h-24 w-full mb-4" />
          <div className="skeleton h-6 w-32 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-24 md:py-32 px-6 bg-bg-card" aria-labelledby="testimonials-heading">
      <div className="max-w-3xl mx-auto">
        <SectionHeading subtitle="What They Say" title="Guest Experiences" />

        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            {testimonials.length > 0 && (
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <Stars rating={testimonials[current].rating} />
                <blockquote className="font-serif text-xl md:text-2xl text-cream/90 italic leading-relaxed mb-6">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>
                <p className="text-gold tracking-widest uppercase text-sm">
                  — {testimonials[current].name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8" role="group" aria-label="Testimonial navigation">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                i === current ? '' : ''
              }`}
            >
              <span
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-gold w-6' : 'bg-border hover:bg-text-dim'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
