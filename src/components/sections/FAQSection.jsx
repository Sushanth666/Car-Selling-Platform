import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQ_DATA } from '../../data/brands';

export default function FAQSection({ onOpenContact }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 relative bg-luxury-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-900 border border-gold-400/30 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Collector Knowledge & Protocols</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Frequently Addressed Inquiries
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Everything you need to understand regarding our provenance certification, private viewing logistics, and bespoke acquisition pathways.
          </p>
        </motion.div>

        {/* Accordions */}
        <div className="space-y-3">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-white">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-white/5 border border-white/10 text-gold-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gold-400/20' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/5">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Direct Help Callout Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-gradient-to-r from-luxury-900 via-luxury-850 to-luxury-900 border border-gold-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gold-400/10 text-gold-400 border border-gold-400/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Have a specific bespoke acquisition request?</h4>
              <p className="text-xs text-slate-400">Our discreet senior concierge advisors are on call 24 hours daily.</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenContact}
            className="px-5 py-2.5 rounded-xl bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all flex-shrink-0 cursor-pointer"
          >
            Direct Concierge Desk
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
