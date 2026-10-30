import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Heart, Scale, Gauge, Zap, Compass, 
  Check, Share2, Calculator, Calendar, 
  Disc, Sliders, ChevronLeft, ChevronRight, FileText, Flame
} from 'lucide-react';
import { engineSound } from '../../utils/engineSound';
import { formatPriceByCurrency } from '../../utils/currency';
import CarPaintViewer from '../vehicle/CarPaintViewer';

export default function CarDetailsModal({
  car,
  isOpen,
  onClose,
  selectedColor: initialSelectedColor,
  onSelectColor,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onBookTestDrive,
  onShowToast,
  currentCurrency = "INR",
  onOpenFinance,
  onOpenSpecSheet,
  onOpenDragRace
}) {
  const galleryImages = car?.gallery && car.gallery.length > 0 ? car.gallery : (car?.heroImage ? [car.heroImage] : []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentColor, setCurrentColor] = useState(
    initialSelectedColor || car?.defaultColour || car?.colors?.[0] || null
  );
  const [prevColorProp, setPrevColorProp] = useState(initialSelectedColor);
  const [prevCarId, setPrevCarId] = useState(car?.id);
  const [isRevving, setIsRevving] = useState(false);

  // Sync state if props change (React recommended render-phase adjustment)
  if (initialSelectedColor !== prevColorProp || car?.id !== prevCarId) {
    setPrevColorProp(initialSelectedColor);
    setPrevCarId(car?.id);
    setCurrentColor(initialSelectedColor || car?.defaultColour || car?.colors?.[0] || null);
    setActiveImageIndex(0);
  }

  const handlePrevImage = () => {
    if (galleryImages.length === 0) return;
    setActiveImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    if (galleryImages.length === 0) return;
    setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
  };

  useEffect(() => {
    if (!isOpen || !car) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && galleryImages.length > 0) {
        setActiveImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
      if (e.key === 'ArrowRight' && galleryImages.length > 0) {
        setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, car, onClose, galleryImages.length]);

  const handleSelectColor = (color) => {
    setCurrentColor(color);
    setActiveImageIndex(0); // Switch to paint showcase view
    if (onSelectColor && car) {
      onSelectColor(car.id, color);
    }
  };

  // Financing calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(36);
  const interestRate = 0.085; // 8.5% p.a. Indian luxury auto financing

  const carPrice = car?.price || 0;
  const downPaymentAmount = (carPrice * (downPaymentPercent / 100));
  const principal = carPrice - downPaymentAmount;
  const monthlyRate = interestRate / 12;
  const estimatedMonthly = carPrice > 0 ? Math.round(
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths))) /
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
  ) : 0;

  const formatINR = (val) => {
    return formatPriceByCurrency(val, currentCurrency);
  };

  const handleRevAudio = () => {
    if (isRevving || !car) return;
    setIsRevving(true);
    engineSound.playRev(car);
    setTimeout(() => setIsRevving(false), 2400);
  };

  const handleShare = () => {
    if (!car) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      if (onShowToast) onShowToast(`Vehicle dossier link for ${car.name} copied!`);
    }
  };

  if (!isOpen || !car) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 cursor-pointer"
      onClick={onClose}
    >
      
      {/* Modal Container */}
      <motion.div 
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        id="car-details-modal"
        className="relative w-full max-w-6xl bg-luxury-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[94vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-luxury-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-gold-400 text-luxury-950">
              {car.category}
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-slate-300 font-mono hidden sm:inline">
              VIN: {car.vin}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
              title="Share Vehicle"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Compare toggle */}
            <button
              onClick={() => onToggleCompare(car)}
              className={`p-2 rounded-full transition-colors border ${
                isCompared
                  ? 'bg-gold-400 border-gold-400 text-luxury-950 shadow-glow-gold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-gold-400'
              }`}
              title={isCompared ? "In Comparison" : "Add to Comparison"}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() => onToggleWishlist(car)}
              className={`p-2 rounded-full transition-colors border ${
                isWishlisted
                  ? 'bg-crimson-600 border-crimson-500 text-white shadow-glow-crimson'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-crimson-400'
              }`}
              title={isWishlisted ? "Saved" : "Save"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            {/* Close Modal */}
            <button
              id="car-details-close-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2 cursor-pointer"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          
          {/* Main Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Multi-angle Photo Gallery */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Active Large Image Display with 3D Holographic Turntable Perspective */}
              <div className="perspective-1000">
                <div 
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-luxury-900 border border-white/15 shadow-2xl group select-none card-3d-bevel transition-transform duration-500 hover:rotate-x-1"
                >
                  {/* Holographic Laser Grid Scanner */}
                  <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent pointer-events-none z-30 animate-holo-scan shadow-[0_0_12px_rgba(217,170,74,0.8)]" />

                  {activeImageIndex === 0 ? (
                    <CarPaintViewer
                      car={car}
                      selectedColor={currentColor}
                      alt={`${car.name} in ${currentColor?.name || 'Default'}`}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  ) : (
                    <img
                      src={galleryImages[activeImageIndex]}
                      alt={`${car.name} Angle ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  )}
                  
                  {/* Overlay status badge */}
                  <div className="absolute top-4 left-4 z-20" style={{ transform: 'translateZ(20px)' }}>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {car.stockStatus}
                    </span>
                  </div>

                {/* Selected Paint Tag on Image */}
                {currentColor && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/75 backdrop-blur-md text-white border border-white/15 flex items-center gap-2 shadow-lg">
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block border border-white/40 shadow-sm"
                        style={{ backgroundColor: currentColor.hex }}
                      />
                      <span>{currentColor.name}</span>
                      <span className="text-[10px] text-gold-400 font-mono">({currentColor.hex})</span>
                    </span>
                  </div>
                )}

                {/* Prev Image Button */}
                {galleryImages.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 z-20"
                    title="Previous Image Angle (←)"
                    aria-label="Previous view"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Next Image Button */}
                {galleryImages.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 z-20"
                    title="Next Image Angle (→)"
                    aria-label="Next view"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Cockpit Engine Start Ignition Button (Option 2) */}
                <button
                  onClick={handleRevAudio}
                  disabled={isRevving}
                  style={{ transform: 'translateZ(26px)' }}
                  className={`absolute bottom-4 right-4 z-20 flex items-center gap-2.5 px-3 py-2 rounded-full backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-2xl group/ignite ${
                    isRevving
                      ? 'bg-gradient-to-r from-red-600 via-crimson-600 to-amber-600 border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-105 animate-pulse'
                      : 'bg-luxury-950/90 hover:bg-black border-gold-400/50 hover:border-gold-400 shadow-[0_4px_20px_rgba(0,0,0,0.7)] hover:scale-105'
                  }`}
                  title="Supercar Cockpit Engine Start & Exhaust Rev"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isRevving
                      ? 'bg-white shadow-md'
                      : 'bg-gradient-to-br from-amber-500 to-red-600 border border-white/30 shadow-inner'
                  }`}>
                    <Flame className={`w-4 h-4 transition-transform ${
                      isRevving ? 'text-red-600 fill-red-600 animate-bounce' : 'text-white fill-white group-hover/ignite:scale-110'
                    }`} />
                  </div>

                  <div className="flex flex-col text-left leading-none pr-1">
                    <span className={`text-[8.5px] uppercase tracking-widest font-extrabold transition-colors ${
                      isRevving ? 'text-white' : 'text-gold-400'
                    }`}>
                      {isRevving ? 'IGNITED' : 'START'}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-black font-mono transition-colors ${
                      isRevving ? 'text-amber-200' : 'text-slate-200 group-hover/ignite:text-white'
                    }`}>
                      {isRevving ? 'EXHAUST ROAR' : 'REV EXHAUST'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

              {/* Thumbnails Row */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === i
                        ? 'border-gold-400 shadow-glow-gold scale-102'
                        : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    {i === 0 ? (
                      <CarPaintViewer
                        car={car}
                        selectedColor={currentColor}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img src={imgUrl} alt={`Angle ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/70 text-slate-300">
                      {i === 0 ? 'Custom Paint' : `Angle ${i + 1}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Exterior Paint Swatches Customizer */}
              {car.colors && car.colors.length > 0 && (
                <div className="p-4 rounded-2xl bg-luxury-900/80 border border-white/15 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-gold-400" />
                      Atelier Real-Time Paint Customizer:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {currentColor?.name || car.colors[0].name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {currentColor?.finish || 'Metallic Finish'}
                      </span>
                      <span className="text-[10px] font-mono text-gold-400 font-bold bg-gold-400/10 px-1.5 py-0.5 rounded border border-gold-400/30">
                        {currentColor?.hex}
                      </span>
                    </div>
                  </div>

                  {/* Swatches Grid */}
                  <div className="flex flex-wrap items-center gap-3 p-1.5">
                    {car.colors.map((color, i) => {
                      const isSelected = currentColor?.name === color.name;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectColor(color)}
                          className={`group relative p-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'border-gold-400 scale-110 shadow-glow-gold ring-2 ring-gold-400/50'
                              : 'border-white/20 hover:border-white/60 hover:scale-105'
                          }`}
                          title={`${color.name} (${color.finish || 'Metallic'}) - ${color.hex}`}
                        >
                          <span
                            className="block w-6 h-6 rounded-full shadow-inner border border-white/20"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Select any bespoke factory paint swatch above to update the vehicle render in real time.
                  </p>
                </div>
              )}

            </div>

            {/* Right Column: Key Details, Price, Performance Matrix & Booking CTA */}
            <div className="lg:col-span-5 space-y-6">
              
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold mb-1">
                  {car.brand} • Model Year {car.year}
                </p>
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                  {car.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-display font-extrabold text-gold-400">
                    {formatPriceByCurrency(car.price, currentCurrency)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-slate-400">
                    Ex-Showroom India • Incl. GST & Customs
                  </span>
                </div>
              </div>

              {/* Performance Triad */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-luxury-900/80 border border-white/10">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Peak Output</span>
                  <span className="text-xl font-display font-bold text-white flex items-center justify-center gap-1 mt-1">
                    <Gauge className="w-4 h-4 text-crimson-500" />
                    {car.horsepower} <span className="text-[10px] text-slate-400">BHP</span>
                  </span>
                </div>
                <div className="text-center border-x border-white/10">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">0-100 KM/H</span>
                  <span className="text-xl font-display font-bold text-gold-400 flex items-center justify-center gap-1 mt-1">
                    <Zap className="w-4 h-4 text-gold-400" />
                    {car.acceleration}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">V-Max Speed</span>
                  <span className="text-xl font-display font-bold text-white flex items-center justify-center gap-1 mt-1">
                    <Compass className="w-4 h-4 text-electric-400" />
                    {car.topSpeedNum} <span className="text-[10px] text-slate-400">KM/H</span>
                  </span>
                </div>
              </div>

              {/* Narrative description */}
              <p className="text-slate-300 text-sm leading-relaxed">
                {car.description}
              </p>

              {/* Key Technical Highlights Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                  Engineering & Aero Highlights
                </h4>
                <div className="space-y-1.5">
                  {car.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onBookTestDrive(car);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-amber-500 to-amber-600 text-luxury-950 font-bold text-sm uppercase tracking-widest shadow-glow-gold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Private Test Drive</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onToggleCompare(car)}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold tracking-wider uppercase border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-gold-400" />
                    <span>{isCompared ? "In Comparison" : "Compare Specs"}</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(car)}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold tracking-wider uppercase border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-crimson-500 text-crimson-500' : 'text-slate-300'}`} />
                    <span>{isWishlisted ? "Bookmarked" : "Wishlist"}</span>
                  </button>
                </div>

                {/* Additional Atelier Luxury Actions: Monroney, EMI, Drag Race */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {onOpenSpecSheet && (
                    <button
                      onClick={() => onOpenSpecSheet(car, currentColor)}
                      className="py-2.5 px-2 rounded-xl bg-luxury-900 hover:bg-gold-400/10 border border-gold-400/30 text-gold-400 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Generate Official Monroney Window Sticker"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Monroney</span>
                    </button>
                  )}

                  {onOpenFinance && (
                    <button
                      onClick={() => onOpenFinance(car)}
                      className="py-2.5 px-2 rounded-xl bg-luxury-900 hover:bg-gold-400/10 border border-white/15 hover:border-gold-400/30 text-slate-200 hover:text-gold-400 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Calculate Indian On-Road Price & EMI"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>On-Road</span>
                    </button>
                  )}

                  {onOpenDragRace && (
                    <button
                      onClick={() => onOpenDragRace(car)}
                      className="py-2.5 px-2 rounded-xl bg-luxury-900 hover:bg-gold-400/10 border border-white/15 hover:border-gold-400/30 text-slate-200 hover:text-gold-400 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Simulate 0-100 Drag Race"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Drag Strip</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Detailed Technical Specifications Table */}
          <div className="border-t border-white/10 pt-8 space-y-4">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-gold-400" />
              <h3 className="text-xl font-display font-bold text-white">Full Technical Specifications</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Engine Configuration</span>
                <p className="text-sm font-semibold text-white mt-1">{car.engine}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Transmission</span>
                <p className="text-sm font-semibold text-white mt-1">{car.transmission}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Drivetrain</span>
                <p className="text-sm font-semibold text-white mt-1">{car.drivetrain}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Fuel / Powertrain Type</span>
                <p className="text-sm font-semibold text-white mt-1">{car.fuelType}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Curb Weight</span>
                <p className="text-sm font-semibold text-white mt-1">{car.curbWeight}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Seating Capacity</span>
                <p className="text-sm font-semibold text-white mt-1">{car.seats} Passengers / {car.doors} Doors</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Current Odometer</span>
                <p className="text-sm font-semibold text-white mt-1">{car.mileage}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Chassis VIN</span>
                <p className="text-sm font-mono text-gold-400 mt-1">{car.vin}</p>
              </div>
              <div className="p-4 rounded-xl bg-luxury-900/60 border border-white/5">
                <span className="text-[10px] uppercase text-slate-400 font-medium">Exhaust Symphony</span>
                <p className="text-xs text-slate-300 mt-1">{car.exhaustProfile}</p>
              </div>
            </div>
          </div>

          {/* Luxury Lease & Financing Calculator */}
          <div className="border-t border-white/10 pt-8">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-luxury-900 via-luxury-850 to-luxury-900 border border-gold-400/25 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gold-400/10 text-gold-400 border border-gold-400/30">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold text-white">Private Concierge Financing Estimator (India)</h4>
                    <p className="text-xs text-slate-400">Tailored luxury asset terms with 8.5% p.a. indicative private banking rate</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs uppercase text-slate-400 block">Est. Monthly Investment</span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-gold-400">
                    {formatPriceByCurrency(estimatedMonthly, currentCurrency)} <span className="text-xs text-slate-400 font-normal">/mo</span>
                  </span>
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Down Payment Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Down Payment ({downPaymentPercent}%)</span>
                    <span className="font-semibold text-gold-400 font-mono">
                      {formatINR(downPaymentAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-gold-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>10% ({formatINR(car.price * 0.1)})</span>
                    <span>50% ({formatINR(car.price * 0.5)})</span>
                  </div>
                </div>

                {/* Term Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Lease / Loan Term</span>
                    <span className="font-semibold text-gold-400 font-mono">{loanTermMonths} Months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[24, 36, 48, 60].map((months) => (
                      <button
                        key={months}
                        onClick={() => setLoanTermMonths(months)}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                          loanTermMonths === months
                            ? 'bg-gold-400 text-luxury-950 font-bold shadow-glow-gold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {months}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </motion.div>

    </motion.div>
  );
}
