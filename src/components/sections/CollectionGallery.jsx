import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, RotateCcw, 
  Sparkles, ChevronDown, Filter, Zap, Flame, Calculator, Clock, ArrowRight,
  ChevronLeft, ChevronRight, Compass, Crown, Shield, BatteryCharging
} from 'lucide-react';
import CarCard from '../vehicle/CarCard';
import { matchesCarQuery } from '../../utils/searchHelper';
import { formatPriceByCurrency } from '../../utils/currency';

const ICON_MAP = {
  Sparkles,
  Flame,
  Zap,
  Compass,
  Crown,
  Shield,
  BatteryCharging
};

export default function CollectionGallery({
  allCars,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  searchQuery,
  setSearchQuery,
  wishlistIds,
  onToggleWishlist,
  compareIds,
  onToggleCompare,
  onInspectCar,
  onBookTestDrive,
  onOpenSearchModal,
  carColorSelections = {},
  onSelectColor,
  currentCurrency = "INR",
  recentlyViewedCars = [],
  onOpenFinance,
  onOpenSpecSheet,
  onOpenDragRace,
  onOpenRevBattle
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const overflows = scrollWidth > clientWidth + 4;
      setIsOverflowing(overflows);
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 15);
    }
  };

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    const t = setTimeout(updateScrollState, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(t);
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth'
      });
      setTimeout(updateScrollState, 350);
    }
  };

  const categoryPills = useMemo(() => {
    const counts = { all: allCars.length };
    allCars.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    return [
      { id: "all", name: "All Fleet", icon: "Sparkles", count: counts.all || 14 },
      { id: "Supercars", name: "Supercars", icon: "Flame", count: counts["Supercars"] || 4 },
      { id: "Hypercars", name: "Hypercars", icon: "Zap", count: counts["Hypercars"] || 4 },
      { id: "Sports Cars", name: "Sports Cars", icon: "Flame", count: counts["Sports Cars"] || 1 },
      { id: "Luxury SUVs", name: "Luxury SUVs", icon: "Shield", count: counts["Luxury SUVs"] || 3 },
      { id: "Grand Tourers", name: "Grand Tourers", icon: "Compass", count: counts["Grand Tourers"] || 1 },
      { id: "Electric Exotics", name: "Electric Exotics", icon: "BatteryCharging", count: counts["Electric Exotics"] || 1 }
    ];
  }, [allCars]);
  
  // Advanced filters state
  const [maxPrice, setMaxPrice] = useState(300000000);
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedDrivetrain, setSelectedDrivetrain] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [sortBy, setSortBy] = useState("featured"); // 'featured' | 'price-asc' | 'price-desc' | 'hp-desc' | 'acc-asc' | 'speed-desc' | 'year-desc'

  // Extract unique brands
  const brandsList = useMemo(() => {
    const set = new Set(allCars.map(c => c.brand));
    return ["all", ...Array.from(set)];
  }, [allCars]);

  // Filter & Sort Logic
  const filteredCars = useMemo(() => {
    return allCars.filter((car) => {
      // Normalized robust search query (matches 'rolls royce', 'gt3 rs', etc.)
      if (searchQuery.trim() && !matchesCarQuery(car, searchQuery)) {
        return false;
      }

      // Category
      if (selectedCategory !== "all" && car.category !== selectedCategory) {
        return false;
      }

      // Brand
      if (selectedBrand !== "all" && car.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }

      // Max Price
      if (car.price > maxPrice) {
        return false;
      }

      // Fuel Type
      if (selectedFuelType !== "all" && !car.fuelType.includes(selectedFuelType.replace(" (PHEV)", "").replace(" (HPEV)", ""))) {
        return false;
      }

      // Drivetrain
      if (selectedDrivetrain !== "all" && !car.drivetrain.includes(selectedDrivetrain)) {
        return false;
      }

      // Transmission
      if (selectedTransmission !== "all" && !car.transmission.toLowerCase().includes(selectedTransmission.toLowerCase())) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "hp-desc") return b.horsepower - a.horsepower;
      if (sortBy === "acc-asc") return parseFloat(a.acceleration) - parseFloat(b.acceleration);
      if (sortBy === "speed-desc") return b.topSpeedNum - a.topSpeedNum;
      if (sortBy === "year-desc") return b.year - a.year;
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [
    allCars, searchQuery, selectedCategory, selectedBrand, maxPrice, 
    selectedFuelType, selectedDrivetrain, selectedTransmission, sortBy
  ]);

  const handleResetFilters = () => {
    onSelectCategory("all");
    onSelectBrand("all");
    setSearchQuery("");
    setMaxPrice(300000000);
    setSelectedFuelType("all");
    setSelectedDrivetrain("all");
    setSelectedTransmission("all");
    setSortBy("featured");
  };

  const activeFilterCount = (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (maxPrice < 300000000 ? 1 : 0) +
    (selectedFuelType !== "all" ? 1 : 0) +
    (selectedDrivetrain !== "all" ? 1 : 0) +
    (selectedTransmission !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <section id="collection" className="py-20 relative bg-luxury-950 carbon-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.25em] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Showroom Fleet</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              The Grand Automotive Collection
            </h2>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Displaying <strong className="text-gold-400 text-sm">{filteredCars.length}</strong> of {allCars.length} Masterpieces
          </div>
        </div>

        {/* ATELIER INTERACTIVE SUITE: Drag Race, Sound Lounge & On-Road EMI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Drag Strip Card */}
          <div 
            id="card-drag-strip"
            role="button"
            tabIndex={0}
            onClick={() => onOpenDragRace && onOpenDragRace(null)}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-luxury-900 to-luxury-950 border border-amber-500/30 hover:border-amber-400/70 transition-all duration-300 shadow-xl cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
                <span>Simulator</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
              0–100 km/h Drag Strip
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Engage Launch Control head-to-head battle with quarter-mile telemetry splits.
            </p>
          </div>

          {/* Sound Lounge Card */}
          <div 
            id="card-exhaust-sound"
            role="button"
            tabIndex={0}
            onClick={() => onOpenRevBattle && onOpenRevBattle()}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-luxury-900 to-luxury-950 border border-orange-500/30 hover:border-orange-400/70 transition-all duration-300 shadow-xl cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-orange-400">
                <Flame className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 flex items-center gap-1">
                <span>Soundboard</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
              Exhaust Sound Lounge
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Push the rev pedal to 9,000 RPM redline across V12, W16, and Flat-6 screamers.
            </p>
          </div>

          {/* EMI & Tax Desk Card */}
          <div 
            id="card-finance-desk"
            role="button"
            tabIndex={0}
            onClick={() => onOpenFinance && onOpenFinance(null)}
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-luxury-900 to-luxury-950 border border-emerald-500/30 hover:border-emerald-400/70 transition-all duration-300 shadow-xl cursor-pointer group hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Calculator className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                <span>Finance Desk</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Indian On-Road & EMI Desk
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Calculate State RTO (TN, KA, MH, KL), Luxury Cess & Section 32 corporate lease shields.
            </p>
          </div>
        </div>

        {/* RECENTLY INSPECTED CHASSIS RAIL (Appears once user explores cars) */}
        {recentlyViewedCars && recentlyViewedCars.length > 0 && (
          <div className="p-4 rounded-2xl bg-luxury-900/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-gold-400 uppercase tracking-widest font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Recently Inspected Chassis</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {recentlyViewedCars.length} in history
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {recentlyViewedCars.map((car) => (
                <div
                  key={`recent-${car.id}`}
                  onClick={() => onInspectCar(car)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-luxury-950/80 border border-white/10 hover:border-gold-400/40 transition-colors cursor-pointer flex-shrink-0 group"
                >
                  <img
                    src={car.defaultImage}
                    alt={car.name}
                    className="w-12 h-9 object-cover rounded-lg border border-white/10"
                  />
                  <div className="pr-2">
                    <span className="text-xs font-bold text-white group-hover:text-gold-400 block truncate max-w-[140px]">
                      {car.name}
                    </span>
                    <span className="text-[10px] font-mono text-gold-400 block">
                      {formatPriceByCurrency(car.price, currentCurrency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Toolbar: Search Bar, Quick Filters, Sort & View Mode */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-gold-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search fleet (e.g. Rolls-Royce, V12, Ferrari, 800+ hp)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-luxury-900 border border-white/15 rounded-xl pl-11 pr-24 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
                {onOpenSearchModal && (
                  <button
                    onClick={onOpenSearchModal}
                    className="px-2 py-1 rounded-lg bg-gold-400/10 hover:bg-gold-400/20 text-gold-400 text-[10px] font-bold uppercase tracking-wider border border-gold-400/30 transition-colors cursor-pointer"
                    title="Open Search Options Popup"
                  >
                    Options
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`px-4 py-3 rounded-xl border text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 ${
                showFilterDrawer || activeFilterCount > 0
                  ? 'bg-gold-400/20 border-gold-400 text-gold-400 shadow-glow-gold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold-400 text-luxury-950 font-bold text-[10px] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-luxury-900 border border-white/15 rounded-xl px-4 py-3 pr-9 text-xs text-slate-200 focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  <option value="featured">Sort: Featured Collection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="hp-desc">Output: Highest Horsepower</option>
                  <option value="acc-asc">0-100: Fastest Acceleration</option>
                  <option value="speed-desc">Top Speed: Highest V-Max (km/h)</option>
                  <option value="year-desc">Year: Newest Release</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* View Switcher (Grid vs List) */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-luxury-900 border border-white/15">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? 'bg-gold-400 text-luxury-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? 'bg-gold-400 text-luxury-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Premier Category Filter Pill Bar */}
          <div className="relative w-full pt-1 pb-1">
            {/* Scroll Left Button */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleScroll('left')}
                  className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-luxury-900/95 border border-gold-400/50 text-gold-400 flex items-center justify-center shadow-xl shadow-black/80 hover:bg-gold-400 hover:text-luxury-950 transition-all cursor-pointer"
                  title="Scroll Categories Left"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Scroll Right Button */}
            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleScroll('right')}
                  className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-luxury-900/95 border border-gold-400/50 text-gold-400 flex items-center justify-center shadow-xl shadow-black/80 hover:bg-gold-400 hover:text-luxury-950 transition-all cursor-pointer"
                  title="Scroll Categories Right"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Pill Container */}
            <div 
              ref={scrollRef}
              onScroll={updateScrollState}
              className={`w-full overflow-x-auto scrollbar-none py-1 scroll-smooth flex ${
                isOverflowing ? 'justify-start' : 'justify-start sm:justify-center'
              }`}
            >
              <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                {categoryPills.map((cat) => {
                  const Icon = ICON_MAP[cat.icon] || Sparkles;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      id={`category-pill-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        if (selectedBrand !== "all" && onSelectBrand) {
                          onSelectBrand("all");
                        }
                      }}
                      className={`flex-shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 border cursor-pointer select-none whitespace-nowrap ${
                        isSelected
                          ? 'bg-gradient-to-r from-gold-400 via-amber-500 to-amber-600 text-luxury-950 border-gold-400 shadow-glow-gold'
                          : 'bg-luxury-900/80 text-slate-300 border-white/10 hover:border-gold-400/40 hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-luxury-950' : 'text-gold-400'}`} />
                      <span className="whitespace-nowrap">{cat.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${isSelected ? 'bg-luxury-950/25 text-luxury-950 font-bold' : 'bg-white/10 text-slate-400'}`}>
                        {cat.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Expandable Advanced Filter Drawer */}
          {showFilterDrawer && (
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
              
              {/* Marque Brand Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Automotive Marque
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => onSelectBrand(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="all">All Prestigious Brands</option>
                  {brandsList.filter(b => b !== "all").map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Fuel & Powertrain */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Powertrain Tech
                </label>
                <select
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="all">All Powertrains</option>
                  <option value="Gasoline">Pure Atmospheric & Biturbo Gasoline</option>
                  <option value="Plug-in Hybrid">High Performance Hybrid (PHEV)</option>
                  <option value="100% Electric">100% Pure Electric</option>
                </select>
              </div>

              {/* Drivetrain */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Drivetrain Traction
                </label>
                <select
                  value={selectedDrivetrain}
                  onChange={(e) => setSelectedDrivetrain(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400"
                >
                  <option value="all">All Traction Systems</option>
                  <option value="Rear-Wheel Drive">Rear-Wheel Drive (RWD Track)</option>
                  <option value="All-Wheel Drive">All-Wheel Drive (AWD / 4WD)</option>
                </select>
              </div>

              {/* Price Cap Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="uppercase tracking-wider font-semibold">Max Price</span>
                  <span className="font-mono font-bold text-gold-400">
                    {maxPrice >= 300000000 ? `Any (${formatPriceByCurrency(300000000, currentCurrency)}+)` : formatPriceByCurrency(maxPrice, currentCurrency)}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000000"
                  max="300000000"
                  step="5000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold-400 cursor-pointer"
                />
              </div>

              {/* Active Filter Chips & Reset All */}
              <div className="col-span-full pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/5">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-400 text-xs">
                      Category: {selectedCategory}
                      <button onClick={() => onSelectCategory("all")}>✕</button>
                    </span>
                  )}
                  {selectedBrand !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-400 text-xs">
                      Marque: {selectedBrand}
                      <button onClick={() => onSelectBrand("all")}>✕</button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs">
                      Keyword: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")}>✕</button>
                    </span>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-slate-400 hover:text-gold-400 flex items-center gap-1.5 transition-colors font-medium ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Cars Grid / List Display */}
        {filteredCars.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center space-y-4 border border-white/10">
            <Filter className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-2xl font-display font-bold text-white">
              No Automotive Masterpieces Match Criteria
            </h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              We couldn't locate any vehicles matching your current combination of filters and search queries. Try resetting filters to explore the complete fleet.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-full bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
                : "space-y-4"
            }
          >
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                isWishlisted={wishlistIds.includes(car.id)}
                onToggleWishlist={onToggleWishlist}
                isCompared={compareIds.includes(car.id)}
                onToggleCompare={onToggleCompare}
                onInspect={onInspectCar}
                onBookTestDrive={onBookTestDrive}
                selectedColor={carColorSelections?.[car.id] || car.defaultColour || car.colors?.[0]}
                onSelectColor={onSelectColor}
                viewMode={viewMode}
                currentCurrency={currentCurrency}
                onOpenFinance={onOpenFinance}
                onOpenSpecSheet={onOpenSpecSheet}
                onOpenDragRace={onOpenDragRace}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
