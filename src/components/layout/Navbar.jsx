import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Scale, Menu, X, Phone, Search, ChevronRight, ChevronDown, Zap, Flame, Calculator, Check, Sparkles } from 'lucide-react';
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
  setSearchQuery: _setSearchQuery,
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

  const currencyRef = useRef(null);
  const toolsRef = useRef(null);

  // Close dropdowns on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setIsToolsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCurrencyDropdownOpen(false);
        setIsToolsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleCurrencyDropdown = () => {
    setIsCurrencyDropdownOpen(prev => !prev);
    setIsToolsDropdownOpen(false);
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(prev => !prev);
    setIsCurrencyDropdownOpen(false);
  };

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 scrollbar-none ${
          isScrolled
            ? 'bg-luxury-950/92 backdrop-blur-xl border-b border-white/10 shadow-2xl py-2 sm:py-2.5'
            : 'bg-gradient-to-b from-black/90 via-black/55 to-transparent py-3 sm:py-3.5'
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
            
            {/* Left Column: Brand Logo (AUREUS VELOCE) */}
            <div className="flex items-center flex-shrink-0 z-10">
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

            {/* Center Column: Perfectly Centered Desktop Navigation Pill (Active on xl 1280px+) */}
            <div className="hidden xl:flex items-center justify-center flex-shrink-0">
              <nav className="flex items-center gap-0.5 2xl:gap-1 border border-white/10 rounded-full p-1 bg-luxury-900/80 backdrop-blur-md shadow-xl scrollbar-none">
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

            {/* Right Column: Quick Actions & Utilities */}
            <div className="flex items-center justify-end flex-shrink-0 gap-1.5 sm:gap-2">
              
              {/* Currency Selector Pill */}
              <div className="relative" ref={currencyRef}>
                <button
                  id="currency-switcher-btn"
                  onClick={toggleCurrencyDropdown}
                  className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                    isCurrencyDropdownOpen
                      ? 'bg-gold-400 text-luxury-950 border-gold-400 shadow-glow-gold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-gold-400 border-white/15 hover:border-gold-400/50'
                  }`}
                  title="Switch Display Currency (INR, USD, EUR, AED)"
                  aria-expanded={isCurrencyDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-black ${
                    isCurrencyDropdownOpen ? 'bg-luxury-950 text-gold-400' : 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  }`}>
                    {currentCurrency === 'AED' ? 'AED' : (CURRENCIES[currentCurrency]?.symbol || '₹')}
                  </span>
                  <span className="font-mono font-bold tracking-wide">{currentCurrency}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCurrencyDropdownOpen ? 'rotate-180 text-luxury-950' : 'text-slate-400'
                  }`} />
                </button>

                <AnimatePresence>
                  {isCurrencyDropdownOpen && (
                    <motion.div
                      id="currency-dropdown-menu"
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-11 right-0 w-44 bg-luxury-950/98 backdrop-blur-2xl border border-gold-400/40 rounded-2xl shadow-2xl p-2 space-y-1 z-50 overflow-hidden"
                    >
                      <div className="px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold text-gold-400 border-b border-white/10 flex items-center justify-between mb-1">
                        <span>Global Currency</span>
                        <span className="font-mono text-[8px] text-slate-400">LIVE RATES</span>
                      </div>

                      {Object.values(CURRENCIES).map((curr) => {
                        const isSelected = currentCurrency === curr.code;
                        return (
                          <button
                            key={curr.code}
                            id={`currency-option-${curr.code.toLowerCase()}`}
                            onClick={() => {
                              if (onCurrencyChange) onCurrencyChange(curr.code);
                              setIsCurrencyDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-gold-400 to-amber-500 text-luxury-950 font-extrabold shadow-sm'
                                : 'text-slate-200 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                                isSelected ? 'bg-luxury-950 text-gold-400' : 'bg-white/10 text-slate-300'
                              }`}>
                                {curr.code === 'AED' ? 'AED' : curr.symbol.trim()}
                              </span>
                              <div className="flex flex-col text-left leading-tight">
                                <span className="text-xs font-bold">{curr.code}</span>
                                <span className={`text-[10px] ${isSelected ? 'text-luxury-950/80 font-semibold' : 'text-slate-400'}`}>
                                  {curr.name}
                                </span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-luxury-950 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Luxury Atelier Experiences Dropdown Trigger */}
              <div className="relative hidden sm:block" ref={toolsRef}>
                <button
                  id="navbar-atelier-tools-btn"
                  onClick={toggleToolsDropdown}
                  className={`relative h-9 px-2.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer group flex-shrink-0 ${
                    isToolsDropdownOpen
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-luxury-950 border-amber-400 shadow-glow-gold'
                      : 'bg-white/5 hover:bg-gold-400/20 text-slate-200 hover:text-gold-400 border-white/15 hover:border-gold-400/50'
                  }`}
                  title="Atelier Interactive Experiences (Drag Strip, Sound Room, EMI Estimator)"
                  aria-expanded={isToolsDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Atelier Tools"
                >
                  <div className="relative flex items-center">
                    <Flame className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isToolsDropdownOpen ? 'text-luxury-950 fill-luxury-950' : 'text-amber-400 fill-amber-400/40'
                    }`} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold-400 animate-pulse border border-luxury-950" />
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                    isToolsDropdownOpen ? 'rotate-180 text-luxury-950' : 'text-slate-400'
                  }`} />
                </button>

                <AnimatePresence>
                  {isToolsDropdownOpen && (
                    <motion.div
                      id="navbar-atelier-tools-menu"
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-11 right-0 w-72 bg-luxury-950/98 backdrop-blur-2xl border border-gold-400/40 rounded-2xl shadow-2xl p-2 space-y-1.5 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-extrabold text-gold-400 border-b border-white/10 flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-gold-400" />
                          <span>Interactive Atelier Suite</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-gold-400/15 text-gold-400 font-mono text-[8px] font-bold">
                          3 EXPERIENCES
                        </span>
                      </div>

                      {onOpenDragRace && (
                        <button
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenDragRace();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left group/tool"
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover/tool:scale-110 group-hover/tool:bg-amber-500/25 transition-all flex-shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-xs flex items-center justify-between">
                              <span>0–100 Drag Strip</span>
                              <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded font-semibold">SIMULATOR</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">Head-to-head acceleration shootout</div>
                          </div>
                        </button>
                      )}

                      {onOpenRevBattle && (
                        <button
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenRevBattle();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left group/tool"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-orange-400 group-hover/tool:scale-110 group-hover/tool:bg-red-500/25 transition-all flex-shrink-0">
                            <Flame className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-xs flex items-center justify-between">
                              <span>Exhaust Sound Arena</span>
                              <span className="text-[9px] font-mono text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded font-semibold">AUDIO</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">Pure V8/V12 acoustic rev lounge</div>
                          </div>
                        </button>
                      )}

                      {onOpenFinance && (
                        <button
                          onClick={() => {
                            setIsToolsDropdownOpen(false);
                            onOpenFinance(null);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left group/tool"
                        >
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover/tool:scale-110 group-hover/tool:bg-emerald-500/25 transition-all flex-shrink-0">
                            <Calculator className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-xs flex items-center justify-between">
                              <span>Bespoke EMI & Tax Desk</span>
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-semibold">FINANCE</span>
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">On-road pricing for all Indian states</div>
                          </div>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Trigger Button */}
              <button
                id="navbar-search-btn"
                onClick={onOpenSearchModal}
                className="relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold-400 transition-colors border border-white/10 hover:border-gold-400/40 flex items-center justify-center cursor-pointer group flex-shrink-0"
                title="Search Fleet & Allocations"
                aria-label="Search fleet"
              >
                <Search className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              </button>

              {/* Comparison Shootout Button */}
              <button
                id="navbar-compare-btn"
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
                id="navbar-wishlist-btn"
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
                id="navbar-book-concierge-btn"
                onClick={onOpenBooking}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 h-9 w-9 xl:w-auto xl:px-4 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-luxury-950 font-bold text-xs tracking-wider uppercase shadow-glow-gold hover:shadow-xl transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 transform hover:-translate-y-0.5 active:translate-y-0"
                title="Book VIP Concierge Test Drive"
                aria-label="Book Concierge"
              >
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xl:inline">Book Concierge</span>
              </button>

              {/* Tablet & Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden w-9 h-9 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center cursor-pointer flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Tablet & Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-luxury-950/98 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-6 animate-fadeIn shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-4">
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
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenDragRace) onOpenDragRace(null);
                  }}
                  className="p-3 sm:p-4 rounded-xl bg-luxury-900 border border-white/10 hover:border-amber-400/40 text-center space-y-1.5 cursor-pointer transition-all hover:bg-white/5 group"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-xs font-bold text-white block uppercase">Drag Strip</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenRevBattle) onOpenRevBattle();
                  }}
                  className="p-3 sm:p-4 rounded-xl bg-luxury-900 border border-white/10 hover:border-red-400/40 text-center space-y-1.5 cursor-pointer transition-all hover:bg-white/5 group"
                >
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mx-auto group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-xs font-bold text-white block uppercase">Sound Room</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenFinance) onOpenFinance(null);
                  }}
                  className="p-3 sm:p-4 rounded-xl bg-luxury-900 border border-white/10 hover:border-emerald-400/40 text-center space-y-1.5 cursor-pointer transition-all hover:bg-white/5 group"
                >
                  <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] sm:text-xs font-bold text-white block uppercase">EMI & Tax</span>
                </button>
              </div>

              {/* Mobile Currency Selector Strip */}
              <div className="p-3 sm:p-4 rounded-2xl bg-luxury-900 border border-white/10 space-y-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Display Currency:
                </span>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {Object.values(CURRENCIES).map((curr) => {
                    const isSelected = currentCurrency === curr.code;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => {
                          if (onCurrencyChange) onCurrencyChange(curr.code);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-gold-400 text-luxury-950 shadow-md font-extrabold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-[11px] sm:text-xs font-mono">{curr.code === 'AED' ? 'AED' : curr.symbol.trim()}</span>
                        <span className="text-[9px] sm:text-[10px] opacity-80">{curr.code}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Links Grid: 2 columns on mobile, 3 columns on tablet */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-left px-4 py-3 sm:py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-luxury-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 active:scale-[0.99] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Reserve Private Test Drive</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
