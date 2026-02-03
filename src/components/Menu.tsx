'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { supabase, MenuItem } from '@/lib/supabase';
import { FALLBACK_MENU } from '@/lib/constants';

const categories = ['Antipasti', 'Primi', 'Secondi', 'Pizza', 'Dolci'];

const dietaryIcons: Record<string, { icon: string; label: string }> = {
  vegetarian: { icon: '🌿', label: 'Vegetarian' },
  vegan: { icon: '🌱', label: 'Vegan' },
  'gluten-free': { icon: '🌾', label: 'Gluten Free' },
};

function MenuSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex justify-between items-start gap-4 py-4 border-b border-border">
          <div className="flex-1">
            <div className="skeleton h-5 w-48 mb-2" />
            <div className="skeleton h-4 w-72" />
          </div>
          <div className="skeleton h-5 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [active, setActive] = useState('Antipasti');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category')
          .order('featured', { ascending: false });
        
        if (error || !data || data.length === 0) {
          setItems(FALLBACK_MENU);
        } else {
          setItems(data);
        }
      } catch {
        setItems(FALLBACK_MENU);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = items.filter((item) => item.category === active);

  return (
    <section id="menu" className="py-24 md:py-32 px-6 bg-bg-card" aria-labelledby="menu-heading">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          subtitle="Il Menu"
          title="Crafted with Love"
          description="Each dish is prepared with the finest ingredients, honouring centuries of Italian culinary tradition."
        />

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist" aria-label="Menu categories">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2.5 text-sm tracking-widest uppercase transition-all duration-300 min-h-[44px] ${
                active === cat
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-text-muted hover:text-cream border-b-2 border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <div role="tabpanel" aria-label={`${active} menu items`}>
          {loading ? (
            <MenuSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-0"
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group flex justify-between items-start gap-4 py-6 border-b border-border last:border-0 ${
                      item.featured ? 'relative' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-xl text-cream group-hover:text-gold transition-colors duration-300">
                          {item.name}
                        </h3>
                        {item.featured && (
                          <span className="text-[10px] tracking-widest uppercase text-gold border border-gold/40 px-2 py-0.5">
                            Chef&apos;s Pick
                          </span>
                        )}
                        {item.dietary_tags?.map((tag) => {
                          const info = dietaryIcons[tag];
                          return info ? (
                            <span
                              key={tag}
                              title={info.label}
                              aria-label={info.label}
                              className="text-sm opacity-60"
                            >
                              {info.icon}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <p className="text-text-dim text-sm mt-1 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden group-hover:block w-8 h-[1px] bg-gold/40 transition-all" />
                      <span className="font-serif text-lg text-gold">£{item.price.toFixed(item.price % 1 === 0 ? 0 : 2)}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
