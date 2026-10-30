import React, { useState, useEffect } from 'react';
import { Heart, Scale, Menu, X, Phone, Search, ChevronRight, Zap, Flame, Calculator } from 'lucide-react';
import { CURRENCIES } from '../../utils/currency';
import AureusLogo from '../common/AureusLogo';

export default function Navbar({
  wishlistCount,
  onOpenWishlist,
  compareCount,
  onOpenCompare,
  onOpenBooking,
  activeSection,
  setActiveSection,
  searchQuery = '',
  setSearchQuery,
  onOpenSearchModal,
  currentCurrency = "INR",
  onCurrencyChange,
  onOpenDragRace,
  onOpenRevBattle,
  onOpenFinance
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'collection', label: 'Collection' },
    { id: 'brands', label: 'Marques' },
    { id: 'comparison', label: 'Compare' },
    { id: 'about', label: 'Atelier' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    if (id === 'comparison') {
      onOpenCompare();
      return;
    }
    if (id === 'test-drive') {
      onOpenBooking();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 scrollbar-none overflow-x-hidden ${
          isScrolled
            ? 'bg-luxury-950/92 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2 sm:py-2.5'
            : 'bg-gradient-to-b from-black/90 via-black/55 to-transparent py-3 sm:py-3.5'
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 w-full">
            
            {/* Left Column: Brand Logo (AUREUS VELOCE) */}
            <div className="flex items-center flex-1 min-w-0">
              <a
                href="#"
                className="flex items-center group focus:outline-none cursor-pointer flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <AureusLogo layout="horizontal" size="sm" animated={true} />
              </a>
            </div>

            {/* Center Column: Perfectly Centered Desktop Navigation Pill */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0">
              <nav className="flex items-center gap-0.5 xl:gap-1 border border-white/10 rounded-full p-1 bg-luxury-900/80 backdrop-blur-md shadow-xl scrollbar-none">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] 2xl:text-xs uppercase tracking-wider font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer select-none ${
                      activeSection === link.id
                        ? 'text-luxury-950 bg-gold-400 shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Column: Quick Actions & Utilities (flex-1 to balance left column) */}
            <div className="flex items-center justify-end flex-1 min-w-0 gap-1.5 sm:gap-2">
              
              {/* Currency Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="h-9 px-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold-400 border border-white/10 hover:border-gold-400/40 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Switch Currency (INR, USD, EUR, AED)"
                >
                  <span>{CURRENCIES[currentCurrency]?.flag}</span>
                  <span className="font-mono">{currentCurrency}</span>
                </button>

                {isCurrencyDropdownOpen && (
                  <div className="absolute top-11 right-0 w-36 bg-luxury-950 border border-gold-400/30 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50">
                    {Object.values(CURRENCIES).map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          if (onCurrencyChange) onCurrencyChange(curr.code);
                          setIsCurrencyDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          currentCurrency === curr.code
                            ? 'bg-gold-400 text-luxury-950 font-bold'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{curr.flag}</span>
                          <span>{curr.code}</span>
                        </span>
                        <span className="text-[10px] opacity-70">{curr.symbol.trim()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Luxury Atelier Experiences Dropdown Trigger */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className={`relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full transition-all border flex items-center justify-center cursor-pointer group flex-shrink-0 ${
                    isToolsDropdownOpen
                      ? 'bg-gold-400 text-luxury-950 border-gold-400 shadow-glow-gold'
                      : 'bg-white/5 hover:bg-gold-400/20 text-slate-300 hover:text-gold-400 border border-white/10 hover:border-gold-400/50'
                  }`}
                  title="Atelier Dynamic Tools (Drag Strip, Sound Room, EMI Calculator)"
                >
                  <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                </button>

                {isToolsDropdownOpen && (
                  <div className="absolute top-11 right-0 w-64 bg-luxury-950 border border-gold-400/30 rounded-2xl shadow-2xl p-2 space-y-1.5 z-50 animate-fadeIn">
                    <div className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold text-gold-400 border-b border-white/10 mb-1">
                      Interactive Atelier Tools
                    </div>

                    {onOpenDragRace && (
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenDragRace();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left group/tool"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover/tool:scale-110 transition-transform">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">0-100 Drag Strip</div>
                          <div className="text-[10px] text-slate-400">Head-to-head acceleration shootout</div>
                        </div>
                      </button>
                    )}

                    {onOpenRevBattle && (
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenRevBattle();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left group/tool"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-orange-400 group-hover/tool:scale-110 transition-transform">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">Exhaust Sound Arena</div>
                          <div className="text-[10px] text-slate-400">Pure V8/V12 acoustic rev lounge</div>
                        </div>
                      </button>
                    )}

                    {onOpenFinance && (
                      <button
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenFinance(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left group/tool"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover/tool:scale-110 transition-transform">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">EMI & Tax Calculator</div>
                          <div className="text-[10px] text-slate-400">On-road pricing for all Indian states</div>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Search Trigger Button */}
              <button
                onClick={onOpenSearchModal}
                className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold-400 transition-colors border border-white/10 hover:border-gold-400/40 flex items-center justify-center cursor-pointer group flex-shrink-0"
                title="Search Fleet & Allocations"
                aria-label="Search fleet"
              >
                <Search className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              </button>

              {/* Comparison Shootout Button */}
              <button
                onClick={onOpenCompare}
                className="relative hidden sm:flex w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold-400 transition-colors border border-white/10 items-center justify-center cursor-pointer group flex-shrink-0"
                title="Car Comparison Tool"
              >
                <Scale className="w-4 h-4 transition-transform group-hover:rotate-12" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-gold-400 text-luxury-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {compareCount}
                  </span>
                )}
              </button>

              {/* Saved Wishlist Garage */}
              <button
                onClick={onOpenWishlist}
                className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-crimson-500 transition-colors border border-white/10 flex items-center justify-center cursor-pointer group flex-shrink-0"
                title="Saved Wishlist"
              >
                <Heart className={`w-4 h-4 transition-transform group-hover:scale-110 ${wishlistCount > 0 ? 'fill-crimson-500 text-crimson-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-crimson-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-glow-crimson">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* VIP Concierge Test Drive CTA */}
              <button
                onClick={onOpenBooking}
                className="hidden sm:inline-flex items-center justify-center gap-2 h-9 px-3.5 sm:px-4 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-luxury-950 font-bold text-xs tracking-wider uppercase shadow-glow-gold hover:shadow-xl transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Book Concierge</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center cursor-pointer flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-luxury-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 animate-fadeIn">
            {/* Mobile Search Button -> Opens Search Popup */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSearchModal();
              }}
              className="w-full flex items-center justify-between bg-luxury-900 border border-white/15 hover:border-gold-400/40 rounded-xl px-4 py-3 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-gold-400" />
                <span>{searchQuery ? searchQuery : "Search fleet, marques, models..."}</span>
              </div>
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider bg-gold-400/10 px-2 py-0.5 rounded">
                Search Options
              </span>
            </button>

            {/* Mobile Interactive Tools Grid */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenDragRace) onOpenDragRace(null);
                }}
                className="p-3 rounded-xl bg-luxury-900 border border-white/10 text-center space-y-1 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-[10px] font-bold text-white block uppercase">Drag Strip</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenRevBattle) onOpenRevBattle();
                }}
                className="p-3 rounded-xl bg-luxury-900 border border-white/10 text-center space-y-1 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-orange-400 mx-auto" />
                <span className="text-[10px] font-bold text-white block uppercase">Sound Room</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenFinance) onOpenFinance(null);
                }}
                className="p-3 rounded-xl bg-luxury-900 border border-white/10 text-center space-y-1 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[10px] font-bold text-white block uppercase">EMI & Tax</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                    activeSection === link.id
                      ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-luxury-950 font-bold text-xs tracking-wider uppercase shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Reserve Private Test Drive</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
