import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Gauge, Zap, Compass, ArrowRight, ShieldCheck, Award, Sparkles } from 'lucide-react';
import { engineSound } from '../../utils/engineSound';
import { formatPriceByCurrency } from '../../utils/currency';
import AureusLogo from '../common/AureusLogo';

export default function HeroSection({ heroCars, onInspectCar, onBookTestDrive, currentCurrency = "INR" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevving, setIsRevving] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const activeCar = heroCars[currentIndex] || heroCars[0];

  // Auto slide change every 7 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroCars.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlay, heroCars.length]);

  const handleRevEngine = () => {
    if (isRevving) return;
    setIsRevving(true);
    engineSound.playRev(activeCar);
    setTimeout(() => {
      setIsRevving(false);
    }, 2400);
  };

  const marques = [
    "PORSCHE", "FERRARI", "LAMBORGHINI", "ROLLS-ROYCE", "ASTON MARTIN", "McLAREN", "BUGATTI", "BENTLEY", "MERCEDES-AMG"
  ];

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-24 pb-8 overflow-hidden bg-luxury-950">
      {/* Background Cinematic Backdrop with Framer Motion Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeCar.id}
            src={activeCar.heroImage}
            alt={activeCar.name}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0.2 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="w-full h-full object-cover object-center brightness-[0.45] contrast-110"
          />
        </AnimatePresence>
        
        {/* Dynamic Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-950 via-luxury-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-950/90 via-luxury-950/40 to-transparent" />
        {/* Subtle glowing radial spotlight */}
        <div className="absolute -top-40 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-crimson-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Floating Ember Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <span className="absolute bottom-10 left-[15%] w-2 h-2 rounded-full bg-gold-400/60 blur-[1px] animate-ember" style={{ animationDuration: '7s' }} />
          <span className="absolute bottom-20 left-[35%] w-1.5 h-1.5 rounded-full bg-amber-300/70 blur-[1px] animate-ember" style={{ animationDuration: '9s', animationDelay: '2s' }} />
          <span className="absolute bottom-5 left-[60%] w-2.5 h-2.5 rounded-full bg-gold-400/50 blur-[2px] animate-ember" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <span className="absolute bottom-16 left-[80%] w-1.5 h-1.5 rounded-full bg-amber-400/60 blur-[1px] animate-ember" style={{ animationDuration: '10s', animationDelay: '3.5s' }} />
          <span className="absolute bottom-24 left-[90%] w-2 h-2 rounded-full bg-red-500/40 blur-[1.5px] animate-ember" style={{ animationDuration: '8s', animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-3 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Typography & Key Pitch with Framer Motion */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Top Row: Sovereign Brand Presentation (Creative Golden Eagle Logo strictly ABOVE Title) + Allocation Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex"
              >
                <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-luxury-900/90 via-luxury-900/70 to-luxury-900/40 border border-gold-400/30 backdrop-blur-md shadow-2xl hover:border-gold-400/60 transition-all duration-300 group">
                  <AureusLogo layout="vertical" size="sm" align="left" animated={true} />
                </div>
              </motion.div>

              {/* Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-luxury-900/80 border border-gold-400/30 backdrop-blur-md shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Exclusive Haute Fleet • {activeCar.year}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {activeCar.badge || "Flagship Allocation"}
                </span>
              </motion.div>
            </div>

            {/* Vehicle Title & Brand with Animated Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCar.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm font-semibold tracking-[0.3em] uppercase text-slate-400 mb-1">
                  {activeCar.brand} Heritage
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] text-3d-white">
                  {activeCar.name}
                </h1>
                <p className="text-gold-400 font-display text-2xl sm:text-3xl font-semibold mt-2 text-3d-gold">
                  {formatPriceByCurrency(activeCar.price, currentCurrency)}
                  <span className="text-xs text-slate-400 ml-2 font-normal font-sans tracking-normal uppercase">
                    Ex-Showroom Allocation
                  </span>
                </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl line-clamp-3 mt-3">
                  {activeCar.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons with Framer Motion Micro-interactions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                id="hero-inspect-specs-btn"
                whileHover={{ scale: 1.04, boxShadow: "0 0 35px -5px rgba(229, 184, 58, 0.45)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onInspectCar(activeCar)}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-amber-600 text-luxury-950 font-bold text-xs uppercase tracking-widest shadow-glow-gold transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Inspect Full Specs</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                id="hero-book-testdrive-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onBookTestDrive(activeCar)}
                className="px-6 py-3.5 rounded-full bg-luxury-900/80 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest border border-white/20 hover:border-gold-400/50 backdrop-blur-md transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Book Test Drive</span>
              </motion.button>

              {/* Engine Exhaust Sound Simulator Trigger */}
              <motion.button
                id="hero-rev-audio-btn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleRevEngine}
                disabled={isRevving}
                className={`relative px-4 py-3.5 rounded-full border backdrop-blur-md text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isRevving
                    ? 'bg-crimson-600 border-crimson-400 text-white shadow-glow-crimson scale-105'
                    : 'bg-white/5 border-white/15 text-slate-300 hover:text-gold-400 hover:border-gold-400/50'
                }`}
                title="Rev Engine Exhaust Simulator"
              >
                {isRevving ? (
                  <>
                    <Volume2 className="w-4 h-4 text-white animate-bounce" />
                    <span className="text-white">Revving V8/V12...</span>
                    {/* Visualizer bars */}
                    <span className="flex items-end gap-0.5 h-3 ml-1">
                      <span className="w-1 bg-white animate-pulse h-full" />
                      <span className="w-1 bg-white animate-pulse h-2" />
                      <span className="w-1 bg-white animate-pulse h-3.5" />
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-gold-400" />
                    <span>REV EXHAUST AUDIO</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Quality & Concierge Assurance Micro Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>150-Pt ARAI & Provenance Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>White-Glove Enclosed Delivery Across India</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Right-Hand Drive (RHD) Allocations</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Telemetry Telemetrics Cockpit Display with 3D Perspective */}
          <div className="lg:col-span-5 perspective-1500">
            <motion.div
              initial={{ opacity: 0, rotateY: 10, rotateX: -4, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: -4, rotateX: 3, scale: 1 }}
              whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] space-y-6 card-3d-bevel"
            >
              
              {/* Cockpit Header with Slide Controls */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                    Live Telemetry Specs
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {heroCars.map((car, idx) => (
                    <button
                      key={car.id}
                      onClick={() => {
                        setIsAutoPlay(false);
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-7 bg-gold-400 shadow-glow-gold'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Select ${car.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* High-Impact Performance Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* 0-100 Acceleration */}
                <div className="bg-luxury-900/80 rounded-2xl p-4 border border-white/5 hover:border-gold-400/30 transition-all">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>0 - 100 KM/H</span>
                    <Zap className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                  <div className="text-3xl font-display font-extrabold text-white">
                    {activeCar.acceleration}
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      key={`acc-${activeCar.id}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(20, (5 - parseFloat(activeCar.acceleration)) * 30)}%` }}
                      transition={{ duration: 0.6 }}
                      className="bg-gradient-to-r from-gold-400 to-amber-500 h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Horsepower */}
                <div className="bg-luxury-900/80 rounded-2xl p-4 border border-white/5 hover:border-gold-400/30 transition-all">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Output</span>
                    <Gauge className="w-3.5 h-3.5 text-crimson-500" />
                  </div>
                  <div className="text-3xl font-display font-extrabold text-white">
                    {activeCar.horsepower}
                    <span className="text-xs text-slate-400 font-normal ml-1">BHP</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                    <motion.div
                      key={`hp-${activeCar.id}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (activeCar.horsepower / 1100) * 100)}%` }}
                      transition={{ duration: 0.6 }}
                      className="bg-gradient-to-r from-crimson-500 to-amber-500 h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Top Speed */}
                <div className="bg-luxury-900/80 rounded-2xl p-4 border border-white/5 hover:border-gold-400/30 transition-all">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>V-Max Top Speed</span>
                    <Compass className="w-3.5 h-3.5 text-electric-400" />
                  </div>
                  <div className="text-2xl font-display font-extrabold text-white truncate">
                    {activeCar.topSpeedNum}
                    <span className="text-xs text-slate-400 font-normal ml-1">KM/H</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    {activeCar.topSpeed}
                  </p>
                </div>

                {/* Transmission & Drive */}
                <div className="bg-luxury-900/80 rounded-2xl p-4 border border-white/5 hover:border-gold-400/30 transition-all">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                    <span>Drivetrain</span>
                    <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {activeCar.drivetrain.split('(')[0]}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    {activeCar.transmission}
                  </p>
                </div>
              </div>

              {/* Engine Architecture Specifier */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-luxury-900 via-luxury-850 to-luxury-900 border border-gold-400/20 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-mono uppercase text-gold-400">Powertrain Heart</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{activeCar.engine}</p>
                </div>
                <button
                  onClick={() => onInspectCar(activeCar)}
                  className="p-2 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 text-gold-400 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Car Thumbnail Picker */}
              <div className="flex items-center gap-2 sm:gap-3 pt-1 overflow-x-auto pb-1 scrollbar-none">
                {heroCars.map((car, idx) => (
                  <button
                    key={car.id}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setCurrentIndex(idx);
                    }}
                    className={`relative flex-1 min-w-[70px] sm:min-w-[80px] h-12 sm:h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer flex-shrink-0 ${
                      idx === currentIndex
                        ? 'border-gold-400 scale-105 shadow-glow-gold'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={car.heroImage}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white text-center px-1 truncate">
                        {car.brand}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Marquee Ticker of Premier Automakers */}
      <div className="relative z-10 w-full border-t border-b border-white/10 bg-luxury-950/80 backdrop-blur-md py-3 overflow-hidden">
        <div className="flex items-center space-x-12 animate-marquee whitespace-nowrap text-xs font-display tracking-[0.3em] text-slate-400 uppercase">
          {[...marques, ...marques, ...marques].map((brand, i) => (
            <span key={i} className="flex items-center gap-6">
              <span className="hover:text-gold-400 transition-colors cursor-pointer">{brand}</span>
              <span className="text-gold-500/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
