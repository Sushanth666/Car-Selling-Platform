import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Phone, ShieldCheck, Send, Sparkles, MapPin } from 'lucide-react';

export default function WhatsAppConcierge({ activeCar = null, onOpenBooking }) {
  const [isOpen, setIsOpen] = useState(false);

  // Default WhatsApp link with custom pre-filled message
  const whatsappNumber = "919876543210";
  const carText = activeCar ? ` regarding the ${activeCar.name} (${activeCar.priceFormatted})` : "";
  const defaultMessage = encodeURIComponent(
    `Hello Apex Atelier India, I am interested in inquiring${carText}. Please connect me with a Senior Advisory Partner for private allocation details.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden select-none">
      
      {/* Expanded Concierge Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 bg-luxury-950 border border-gold-400/40 rounded-3xl shadow-2xl overflow-hidden text-white mb-2"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-luxury-900 to-luxury-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-gold-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-luxury-950" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">Apex Private Concierge</h4>
                  <span className="text-[10px] text-emerald-400 font-medium">Senior Partner Online • 24/7 Escrow</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Connect directly with our luxury acquisition desk for discreet Right-Hand Drive allocations, trade-ins, and door-to-door delivery across India.
              </p>

              {activeCar && (
                <div className="p-2.5 rounded-xl bg-luxury-900/80 border border-white/10 flex items-center gap-3">
                  <img
                    src={activeCar.defaultImage}
                    alt={activeCar.name}
                    className="w-12 h-9 object-cover rounded-lg border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Inquiring Chassis:</span>
                    <strong className="text-white text-xs block truncate">{activeCar.name}</strong>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* WhatsApp Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Concierge Call */}
                <a
                  href="tel:+919876543210"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>Call Private Desk (+91 98765 43210)</span>
                </a>

                {/* Schedule Atelier Test Drive */}
                {onOpenBooking && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenBooking(activeCar);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 text-gold-400 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Book Private Atelier Tour</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-gold-400">
                <ShieldCheck className="w-3 h-3" />
                <span>NDA & Escrow Protected</span>
              </span>
              <span>Mumbai • Bangalore • Chennai</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-amber-600 text-luxury-950 font-bold shadow-[0_4px_25px_rgba(234,179,8,0.45)] flex items-center gap-2.5 cursor-pointer border border-gold-300"
        aria-label="Open VIP Concierge"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-luxury-950" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-gold-400 animate-pulse" />
        </div>
        <span className="text-xs uppercase tracking-wider font-extrabold hidden sm:inline">
          VIP Concierge
        </span>
      </motion.button>
    </div>
  );
}
