import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, X, Sparkles, ArrowRight, Zap, Gauge, Compass, 
  MapPin, Flame, Crown, Shield, 
  BatteryCharging, CornerDownLeft
} from 'lucide-react';
import { matchesCarQuery, POPULAR_SEARCH_OPTIONS } from '../../utils/searchHelper';

const ICON_MAP = {
  Crown: Crown,
  Zap: Zap,
  Flame: Flame,
  Sparkles: Sparkles,
  Shield: Shield,
  BatteryCharging: BatteryCharging,
  MapPin: MapPin
};

export default function SearchModal({
  isOpen,
  onClose,
  allCars = [],
  searchQuery,
  setSearchQuery,
  onInspectCar,
  onBookTestDrive,
  onSelectCategory,
  onViewAllInCollection
}) {
  const inputRef = useRef(null);
  const [internalQuery, setInternalQuery] = useState(searchQuery || "");
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery || "");
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceBracket, setPriceBracket] = useState("all"); // 'all' | 'under5' | '5to10' | 'above10'

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setInternalQuery(searchQuery || "");
  }

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Keyboard shortcut Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter cars based on internal query, category, and price bracket
  const matchingCars = allCars.filter((car) => {
    // 1. Text Search matching
    if (!matchesCarQuery(car, internalQuery)) {
      return false;
    }

    // 2. Category filter
    if (activeCategory !== "all" && car.category !== activeCategory) {
      return false;
    }

    // 3. Price bracket filter
    if (priceBracket === "under5" && car.price > 50000000) return false;
    if (priceBracket === "5to10" && (car.price < 50000000 || car.price > 100000000)) return false;
    if (priceBracket === "above10" && car.price <= 100000000) return false;

    return true;
  });

  const handleApplySearch = (carToInspect = null) => {
    setSearchQuery(internalQuery);
    if (onSelectCategory && activeCategory !== "all") {
      onSelectCategory(activeCategory);
    }
    onClose();
    if (carToInspect && onInspectCar) {
      onInspectCar(carToInspect);
    } else if (onViewAllInCollection) {
      onViewAllInCollection();
    }
  };

  const handleSelectQuickOption = (optionQuery) => {
    setInternalQuery(optionQuery);
    setSearchQuery(optionQuery);
  };

  const clearSearch = () => {
    setInternalQuery("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const categories = [
    { id: "all", label: "All Fleet" },
    { id: "Supercars", label: "Supercars" },
    { id: "Hypercars", label: "Hypercars" },
    { id: "Sports Cars", label: "Sports Cars" },
    { id: "Luxury SUVs", label: "Luxury SUVs" },
    { id: "Grand Tourers", label: "Grand Tourers" },
    { id: "Electric Exotics", label: "Electric" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-2xl flex items-start justify-center p-3 sm:p-6 md:p-10 cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 26, stiffness: 340 }}
        className="relative w-full max-w-4xl bg-luxury-950 border border-gold-400/30 rounded-3xl overflow-hidden shadow-2xl mt-4 sm:mt-10 cursor-default flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Interactive Search Input Bar */}
        <div className="relative p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-luxury-900 via-luxury-850 to-luxury-900 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gold-400/15 text-gold-400 border border-gold-400/30 flex-shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <div className="relative flex-1">
            <input
              id="fleet-search-input"
              name="searchQuery"
              aria-label="Search fleet by car name, marque, or engine"
              ref={inputRef}
              type="text"
              placeholder="Search by car name, marque, engine (e.g. Rolls-Royce, Ferrari, V12, GT3 RS)..."
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplySearch();
                }
              }}
              className="w-full bg-transparent text-base sm:text-lg font-medium text-white placeholder-slate-400 focus:outline-none pr-8"
            />
            {internalQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search input"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10 flex-shrink-0"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Options & Category Pills Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-luxury-900/60 border-b border-white/5 space-y-3">
          
          {/* Popular Search Options */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-1.5 flex-shrink-0 mr-1">
              <Sparkles className="w-3 h-3" />
              Popular:
            </span>
            {POPULAR_SEARCH_OPTIONS.map((opt) => {
              const Icon = ICON_MAP[opt.icon] || Sparkles;
              const isActive = internalQuery.toLowerCase() === opt.query.toLowerCase();
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelectQuickOption(opt.query)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 border cursor-pointer ${
                    isActive
                      ? 'bg-gold-400 text-luxury-950 border-gold-400 font-bold shadow-glow-gold'
                      : 'bg-luxury-900/90 text-slate-300 border-white/10 hover:border-gold-400/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3 text-gold-400" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filters Row: Category + Price Bracket */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Silhouette:</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white/15 text-gold-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Price Brackets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mr-1">Price:</span>
              {[
                { id: "all", label: "All" },
                { id: "under5", label: "< ₹5 Cr" },
                { id: "5to10", label: "₹5–₹10 Cr" },
                { id: "above10", label: "> ₹10 Cr" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriceBracket(p.id)}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                    priceBracket === p.id
                      ? 'bg-gold-400/20 text-gold-400 font-bold border border-gold-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          {matchingCars.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
                <Search className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">No allocations matching "{internalQuery}"</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for marques like "Rolls-Royce", "Ferrari", "Porsche", or powertrain specifications like "V12" or "Hybrid".
              </p>
              <button
                onClick={() => {
                  setInternalQuery("");
                  setActiveCategory("all");
                  setPriceBracket("all");
                }}
                className="px-5 py-2 rounded-xl bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-1">
                <span>Matching Allocations ({matchingCars.length})</span>
                <span className="text-[11px] text-slate-500">Click any vehicle to view full specifications</span>
              </div>

              {matchingCars.map((car) => (
                <div
                  key={car.id}
                  onClick={() => handleApplySearch(car)}
                  className="group relative glass-card rounded-2xl p-3 sm:p-4 border border-white/10 hover:border-gold-400/40 hover:bg-luxury-900/90 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-24 sm:w-28 h-18 sm:h-20 rounded-xl overflow-hidden bg-luxury-900 flex-shrink-0 border border-white/10 group-hover:border-gold-400/50 transition-colors">
                      <img
                        src={car.heroImage}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{car.brand}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[10px] font-semibold text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded">
                          {car.category}
                        </span>
                        {car.badge && (
                          <span className="text-[9px] font-medium text-emerald-400 hidden md:inline">
                            ✦ {car.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-display font-bold text-white group-hover:text-gold-400 transition-colors truncate">
                        {car.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
                        <span className="font-display font-bold text-gold-400 text-sm tracking-tight">
                          {car.priceFormatted}
                        </span>
                        <span className="text-white/20">|</span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Gauge className="w-3 h-3 text-crimson-500" />
                          <span className="font-mono font-medium text-slate-300">{car.horsepower}</span> BHP
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Zap className="w-3 h-3 text-gold-400" />
                          0-100: <span className="font-mono font-medium text-slate-300">{car.acceleration}</span>
                        </span>
                        <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                          <Compass className="w-3 h-3 text-electric-400" />
                          <span className="font-mono font-medium text-slate-300">{car.topSpeedNum}</span> KM/H
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        if (onBookTestDrive) onBookTestDrive(car);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                    >
                      Drive
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplySearch(car);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-amber-500 text-luxury-950 text-xs font-bold uppercase tracking-wider shadow-glow-gold hover:shadow-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Collection Browse Button */}
        <div className="px-5 sm:px-6 py-4 bg-luxury-900 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="font-medium text-white">{matchingCars.length}</span>
            <span>of {allCars.length} fleet allocations available in India</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleApplySearch()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-luxury-800 hover:bg-luxury-750 text-slate-200 hover:text-white border border-white/15 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Apply to Gallery & Scroll</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-gold-400" />
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
