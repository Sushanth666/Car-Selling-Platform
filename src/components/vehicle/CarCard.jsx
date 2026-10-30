import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Scale, Gauge, Zap, Compass, ArrowUpRight, Sparkles, Calculator, FileText, Flame } from 'lucide-react';
import { engineSound } from '../../utils/engineSound';
import { formatPriceByCurrency } from '../../utils/currency';
import CarPaintViewer from './CarPaintViewer';

export default function CarCard({
  car,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onInspect,
  onBookTestDrive,
  selectedColor,
  onSelectColor,
  viewMode = "grid",
  currentCurrency = "INR",
  onOpenFinance,
  onOpenSpecSheet,
  onOpenDragRace
}) {
  const [localColor, setLocalColor] = useState(car.defaultColour || car.colors?.[0] || null);
  const [isRevving, setIsRevving] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || viewMode === 'list') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.3
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  const activeColor = selectedColor || localColor || car.defaultColour || car.colors?.[0];

  const handleColorChange = (c) => {
    setLocalColor(c);
    if (onSelectColor) {
      onSelectColor(car.id, c);
    }
  };

  const handleSoundBlip = (e) => {
    e.stopPropagation();
    if (isRevving) return;
    setIsRevving(true);
    engineSound.playRev(car);
    setTimeout(() => setIsRevving(false), 2400);
  };

  if (viewMode === "list") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl overflow-hidden p-4 sm:p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-gold-400/40 transition-all duration-300"
      >
        {/* Thumbnail Image with Real-time Paint Color */}
        <div 
          className="relative w-full md:w-72 h-48 rounded-xl overflow-hidden bg-luxury-900 flex-shrink-0 cursor-pointer" 
          onClick={() => onInspect(car, activeColor)}
        >
          <CarPaintViewer
            car={car}
            selectedColor={activeColor}
            alt={`${car.name} in ${activeColor?.name}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 z-20">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-gold-400 border border-gold-400/30">
              {car.category}
            </span>
          </div>
        </div>

        {/* Info & Metrics */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{car.brand}</p>
              <h3 
                className="text-xl font-display font-bold text-white group-hover:text-gold-400 transition-colors cursor-pointer" 
                onClick={() => onInspect(car, activeColor)}
              >
                {car.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{car.engine}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display font-extrabold text-gold-400">
                {formatPriceByCurrency(car.price, currentCurrency)}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{car.stockStatus}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 py-2 border-y border-white/5">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Power</span>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-crimson-500" />
                {car.horsepower} BHP
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">0-100 KM/H</span>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-gold-400" />
                {car.acceleration}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Top Speed</span>
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-electric-400" />
                {car.topSpeedNum} KM/H
              </p>
            </div>
          </div>

          {/* Interactive Color Swatches Row (List Mode) */}
          {car.colors && car.colors.length > 0 && (
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" 
                  style={{ backgroundColor: activeColor?.hex }} 
                />
                <span className="font-semibold text-white">{activeColor?.name}</span>
                <span className="text-[10px] text-slate-500">({activeColor?.finish || 'Metallic'})</span>
              </span>

              <div className="flex items-center gap-2.5 px-1.5 py-1">
                {car.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange(c);
                    }}
                    className={`w-4 h-4 rounded-full border-2 transition-all cursor-pointer relative ${
                      activeColor?.name === c.name
                        ? 'scale-125 border-gold-400 ring-2 ring-gold-400/50 shadow-glow-gold'
                        : 'border-white/30 hover:scale-115 hover:border-white'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.finish || 'Metallic'})`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(car);
                }}
                className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                  isWishlisted
                    ? 'bg-crimson-600/20 border-crimson-500 text-crimson-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-crimson-500 text-crimson-500' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(car);
                }}
                className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
                  isCompared
                    ? 'bg-gold-400/20 border-gold-400 text-gold-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Comparing' : 'Compare'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onInspect(car, activeColor)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => onBookTestDrive(car)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-luxury-950 font-bold text-xs tracking-wider uppercase transition-all shadow-glow-gold"
              >
                Book Drive
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (Default & Most visually stunning 3D Holographic Card)
  return (
    <div className="perspective-1000 w-full h-full">
      <motion.div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        animate={{ 
          rotateX, 
          rotateY, 
          scale: rotateX !== 0 || rotateY !== 0 ? 1.025 : 1 
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-white/10 hover:border-gold-400/50 shadow-2xl hover:shadow-[0_20px_50px_rgba(217,170,74,0.15)] transition-all duration-300 relative h-full"
      >
        {/* Dynamic 3D Specular Light Glare Reflection */}
        {glarePos.opacity > 0 && (
          <div 
            className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 rounded-3xl mix-blend-overlay"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35), rgba(217,170,74,0.15) 40%, transparent 80%)`,
            }}
          />
        )}

        {/* Top Media Container with Real-Time Paint Engine */}
        <div 
          className="relative aspect-[16/10] overflow-hidden bg-luxury-900 cursor-pointer" 
          onClick={() => onInspect(car, activeColor)}
          style={{ transform: 'translateZ(10px)' }}
        >
          <CarPaintViewer
            car={car}
            selectedColor={activeColor}
            alt={`${car.name} in ${activeColor?.name}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Ambient Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-950 via-transparent to-black/50 pointer-events-none" />

          {/* Floating Top Badges */}
          <div 
            className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20"
            style={{ transform: 'translateZ(24px)' }}
          >
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-luxury-950/80 backdrop-blur-md text-gold-400 border border-gold-400/30 shadow-md">
              {car.category}
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Checkbox Button */}
            <button
              id={`compare-toggle-${car.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(car);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isCompared
                  ? 'bg-gold-400 text-luxury-950 shadow-glow-gold scale-110'
                  : 'bg-black/60 text-slate-300 hover:text-gold-400 hover:bg-black/80'
              }`}
              title={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist Heart Button */}
            <button
              id={`wishlist-toggle-${car.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(car);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isWishlisted
                  ? 'bg-crimson-600 text-white shadow-glow-crimson scale-110'
                  : 'bg-black/60 text-slate-300 hover:text-crimson-400 hover:bg-black/80'
              }`}
              title={isWishlisted ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Floating Bottom Badge on Image */}
        {car.badge && (
          <div className="absolute bottom-3 left-3 pointer-events-none z-20">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-gold-400/90 text-luxury-950 shadow-sm">
              {car.badge}
            </span>
          </div>
        )}

        {/* Cockpit Engine Start Ignition Button (Option 2 - Floating 3D Control) */}
        <button
          onClick={handleSoundBlip}
          disabled={isRevving}
          style={{ transform: 'translateZ(30px)' }}
          className={`absolute bottom-3 right-3 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-xl group/ignite ${
            isRevving
              ? 'bg-gradient-to-r from-red-600 via-crimson-600 to-amber-600 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.7)] scale-105 animate-pulse'
              : 'bg-luxury-950/85 hover:bg-black border-gold-400/50 hover:border-gold-400 shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:scale-105'
          }`}
          title="Supercar Cockpit Engine Start & Exhaust Rev"
        >
          {/* Circular Machined Bezel Core */}
          <div className={`relative w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            isRevving
              ? 'bg-white shadow-md'
              : 'bg-gradient-to-br from-amber-500 to-red-600 border border-white/30 shadow-inner'
          }`}>
            <Flame className={`w-3.5 h-3.5 transition-transform ${
              isRevving ? 'text-red-600 fill-red-600 animate-bounce' : 'text-white fill-white group-hover/ignite:scale-110'
            }`} />
          </div>

          {/* Ignition Text Label */}
          <div className="flex flex-col text-left leading-none pr-1">
            <span className={`text-[8px] uppercase tracking-widest font-extrabold transition-colors ${
              isRevving ? 'text-white' : 'text-gold-400'
            }`}>
              {isRevving ? 'IGNITED' : 'START'}
            </span>
            <span className={`text-[9px] uppercase tracking-wider font-black font-mono transition-colors ${
              isRevving ? 'text-amber-200' : 'text-slate-200 group-hover/ignite:text-white'
            }`}>
              {isRevving ? 'ROARING' : 'REV'}
            </span>
          </div>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Brand & Car Name */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">{car.brand}</span>
            <span className="font-mono">{car.year}</span>
          </div>
          <h3
            onClick={() => onInspect(car, activeColor)}
            className="text-lg font-display font-bold text-white group-hover:text-gold-400 transition-colors cursor-pointer line-clamp-1"
          >
            {car.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {car.engine}
          </p>
        </div>

        {/* Performance Specs Pill Bar */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-luxury-900/90 border border-white/5">
          <div className="text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Output</span>
            <span className="text-xs font-bold text-white font-mono flex items-center justify-center gap-1 mt-0.5">
              <Gauge className="w-3 h-3 text-crimson-500" />
              {car.horsepower} <span className="text-[9px] text-slate-400 font-normal">BHP</span>
            </span>
          </div>
          <div className="text-center border-x border-white/10">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">0-100</span>
            <span className="text-xs font-bold text-gold-400 font-mono flex items-center justify-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-gold-400" />
              {car.acceleration}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Top Speed</span>
            <span className="text-xs font-bold text-white font-mono flex items-center justify-center gap-1 mt-0.5">
              <Compass className="w-3 h-3 text-electric-400" />
              {car.topSpeedNum} <span className="text-[9px] text-slate-400 font-normal">KM/H</span>
            </span>
          </div>
        </div>

        {/* Real-time Interactive Paint Swatches Customizer */}
        {car.colors && car.colors.length > 0 && (
          <div className="p-3 rounded-2xl bg-luxury-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>Paint:</span>
                <span className="font-semibold text-white ml-0.5 truncate max-w-[120px]">{activeColor?.name}</span>
              </span>
              <span className="text-[9px] text-gold-400 font-mono uppercase bg-gold-400/10 px-1.5 py-0.5 rounded">
                {activeColor?.finish || 'Metallic'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1.5 overflow-x-auto scrollbar-none">
              {car.colors.map((c, i) => {
                const isCurrent = activeColor?.name === c.name;
                return (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorChange(c);
                    }}
                    className={`group relative w-5 h-5 rounded-full border-2 transition-all cursor-pointer flex-shrink-0 flex items-center justify-center ${
                      isCurrent
                        ? 'scale-125 border-gold-400 ring-2 ring-gold-400/50 shadow-glow-gold'
                        : 'border-white/25 hover:scale-115 hover:border-white'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`${c.name} (${c.finish || 'Metallic'})`}
                  >
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Action Buttons (3D translateZ) */}
        <div 
          style={{ transform: 'translateZ(28px)' }}
          className="pt-2 border-t border-white/10 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Ex-Showroom Valuation</span>
            <span className="text-xl font-display font-extrabold text-gold-400 text-3d-gold">
              {formatPriceByCurrency(car.price, currentCurrency)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenFinance && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenFinance(car);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-gold-400/20 text-slate-300 hover:text-gold-400 border border-white/10 hover:border-gold-400/40 transition-colors cursor-pointer"
                title="Calculate Indian On-Road Price & EMI"
              >
                <Calculator className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenSpecSheet && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSpecSheet(car, activeColor);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-gold-400/20 text-slate-300 hover:text-gold-400 border border-white/10 hover:border-gold-400/40 transition-colors cursor-pointer"
                title="Official Monroney Spec Sheet (PDF)"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
            )}

            {onOpenDragRace && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDragRace(car);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-amber-400/20 text-slate-300 hover:text-amber-400 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
                title="0-100 Drag Strip Simulator"
              >
                <Flame className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onInspect(car, activeColor)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="View full specs & gallery"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onBookTestDrive(car)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold transition-all duration-300 cursor-pointer"
            >
              Drive
            </button>
          </div>
        </div>

      </div>

    </motion.div>
    </div>
  );
}
