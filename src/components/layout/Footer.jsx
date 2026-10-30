import React, { useState } from 'react';
import { ArrowUp, Mail, Check, Send } from 'lucide-react';
import AureusLogo from '../common/AureusLogo';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ onSelectCategory, onShowToast }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    if (onShowToast) {
      onShowToast(`Welcome to the Apex Private Circle, ${newsletterEmail}.`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-luxury-950 border-t border-white/10 text-slate-400 text-xs relative overflow-hidden">
      {/* Decorative top gold line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-40" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        
        {/* Top Row: Newsletter Signup Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-luxury-900 via-luxury-850 to-luxury-900 border border-gold-400/25 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-1 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">
              Discreet Allocation Bulletins
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Join the Apex Private Circle
            </h3>
            <p className="text-slate-400 text-xs max-w-lg">
              Receive confidential alerts regarding unlisted hypercar allocations, off-market collector transactions, and invitation-only track events.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>You are inducted into the Private Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter confidential email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-luxury-950 border border-white/15 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Induct</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-4">
          
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <AureusLogo layout="vertical" size="md" align="left" animated={true} />

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              India's premier sovereign automotive sanctuary for curated supercars, hypercars, bespoke luxury grand tourers, and rare investment allocations.
            </p>

            <div className="text-[11px] text-slate-500 space-y-1 font-mono">
              <p>Sovereign Concierge Desk: +91 (22) 6988-VELOCE</p>
              <p>Direct Wire: liaison@aureusveloce.com</p>
              <p className="text-gold-400/70">GSTIN: 27AABCA1234F1Z8 • Sovereign Kinetic Vault</p>
            </div>
          </div>

          {/* Column 2: Fleet Categories */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs font-display">
              Classifications
            </h4>
            <ul className="space-y-2">
              {["Supercars", "Hypercars", "Luxury SUVs", "Grand Tourers", "Electric Exotics"].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                      const el = document.getElementById('collection');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-gold-400 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Prestigious Marques */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs font-display">
              Featured Marques
            </h4>
            <ul className="space-y-2">
              {["Porsche", "Ferrari", "Lamborghini", "Rolls-Royce", "Aston Martin", "McLaren", "Bugatti"].map((marque) => (
                <li key={marque}>
                  <a
                    href="#brands"
                    className="hover:text-gold-400 transition-colors"
                  >
                    {marque}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Private Services */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs font-display">
              Concierge Services
            </h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-gold-400 transition-colors">150-Point ARAI Provenance</a></li>
              <li><a href="#about" className="hover:text-gold-400 transition-colors">All-India Hydraulic Transit</a></li>
              <li><a href="#about" className="hover:text-gold-400 transition-colors">Customs & Duty Escrow</a></li>
              <li><a href="#contact" className="hover:text-gold-400 transition-colors">RHD Factory Allocation</a></li>
              <li><a href="#faq" className="hover:text-gold-400 transition-colors">Private Wealth Advisory</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Row */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {CURRENT_YEAR} AUREUS VELOCE (THE SOVEREIGN KINETIC) PRIVATE LIMITED. ALL RIGHTS RESERVED. REGISTERED IN MUMBAI, MAHARASHTRA 🇮🇳.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Discretion Agreement</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Commission</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Provenance Warranties</a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/5 hover:bg-gold-400 hover:text-luxury-950 text-slate-300 transition-all border border-white/5"
              title="Return to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
