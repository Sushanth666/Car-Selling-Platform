import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award } from 'lucide-react';
import { BRANDS_DATA } from '../../data/brands';

export default function BrandsCategories({
  selectedBrand,
  onSelectBrand
}) {
  return (
    <section id="brands" className="py-20 relative bg-luxury-950 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-crimson-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-900 border border-gold-400/30 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>Icons of Automotive Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Prestigious Automotive Marques
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From the visceral screaming V12s of Maranello and Sant’Agata to the whispering electrified sanctuaries of Goodwood, explore world-renowned automotive houses.
          </p>
        </motion.div>

        {/* Premier Brands Grid with 3D Spatial Presence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {BRANDS_DATA.map((brand, idx) => {
            const isBrandActive = selectedBrand.toLowerCase() === brand.name.toLowerCase();
            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -8, rotateX: 5, rotateY: -3, scale: 1.03 }}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => {
                  onSelectBrand(brand.name);
                  const el = document.getElementById('collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative rounded-3xl overflow-hidden glass-card p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between card-3d-bevel shadow-xl hover:shadow-[0_20px_45px_rgba(217,170,74,0.15)] ${
                  isBrandActive
                    ? 'border-gold-400 ring-2 ring-gold-400/40 shadow-glow-gold'
                    : 'border-white/10 hover:border-gold-400/50'
                }`}
              >
                {/* Background Ambient Imagery */}
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-35 transition-opacity duration-700">
                  <img
                    src={brand.bannerImage}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-950 via-luxury-950/90 to-luxury-950/60" />
                </div>

                {/* Card Header */}
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Est. {brand.founded} • {brand.origin.split(',')[1] || brand.origin}
                    </span>
                    <h3 className="text-2xl font-display font-extrabold text-white tracking-wider group-hover:text-gold-400 transition-colors mt-1">
                      {brand.name}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-gold-400 group-hover:bg-gold-400/10 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="relative z-10 my-6 space-y-2">
                  <p className="text-xs font-serif italic text-gold-400">"{brand.tagline}"</p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {brand.totalModels}
                  </span>
                  <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider group-hover:underline flex items-center gap-1">
                    View Fleet
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
