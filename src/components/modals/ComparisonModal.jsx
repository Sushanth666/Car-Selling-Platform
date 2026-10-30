import React from 'react';
import { motion } from 'framer-motion';
import { X, Scale, Zap, Gauge, Compass, Trash2, Plus, Calendar, Award } from 'lucide-react';
import { formatPriceByCurrency } from '../../utils/currency';

export default function ComparisonModal({
  isOpen,
  onClose,
  comparedCars,
  allCars,
  onRemoveFromCompare,
  onAddCarToCompare,
  onClearCompare,
  onBookTestDrive,
  currentCurrency = "INR"
}) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate highest metric values to highlight leaders
  const maxHp = Math.max(...comparedCars.map(c => c.horsepower), 1);
  const minZeroToSixty = Math.min(...comparedCars.map(c => parseFloat(c.acceleration)), 99);
  const maxTopSpeed = Math.max(...comparedCars.map(c => c.topSpeedNum), 1);

  // Available cars to add into empty slots
  const availableCars = allCars.filter(c => !comparedCars.some(comp => comp.id === c.id));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 cursor-pointer"
      onClick={onClose}
    >
      
      <motion.div 
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        className="relative w-full max-w-7xl bg-luxury-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[94vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-luxury-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-400/10 text-gold-400 border border-gold-400/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">
                Fleet Performance Comparison Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Comparing {comparedCars.length} of max 4 vehicles side by side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedCars.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs text-slate-400 hover:text-crimson-400 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {comparedCars.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Scale className="w-16 h-16 text-slate-600 mx-auto stroke-[1.5]" />
              <h3 className="text-2xl font-display font-bold text-white">
                No Vehicles Selected for Comparison
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Add 2 or more supercars from the collection gallery to evaluate horsepower, 0-100 km/h sprint times, top speeds, and bespoke engineering side-by-side.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all"
              >
                Browse Fleet Gallery
              </button>
            </div>
          ) : (
            <>
              {/* Header Car Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {comparedCars.map((car) => (
                  <div
                    key={car.id}
                    className="relative glass-card rounded-2xl p-4 border border-white/10 space-y-3 flex flex-col justify-between"
                  >
                    <button
                      onClick={() => onRemoveFromCompare(car.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-slate-400 hover:text-crimson-400 hover:bg-black/80 transition-colors z-10"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-luxury-900">
                      <img src={car.heroImage} alt={car.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">{car.brand}</p>
                      <h4 className="font-display font-bold text-base text-white line-clamp-1">{car.name}</h4>
                      <p className="text-lg font-display font-extrabold text-gold-400 mt-1">
                        {formatPriceByCurrency(car.price, currentCurrency)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onBookTestDrive(car);
                      }}
                      className="w-full py-2 rounded-xl bg-gold-400/15 hover:bg-gold-400 text-gold-400 hover:text-luxury-950 font-bold text-xs uppercase tracking-wider transition-all border border-gold-400/30 flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Drive This</span>
                    </button>
                  </div>
                ))}

                {/* Add Car Slot if under 4 */}
                {comparedCars.length < 4 && (
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gold-400">
                      <Plus className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                      Add Vehicle ({4 - comparedCars.length} slot left)
                    </p>
                    
                    {availableCars.length > 0 && (
                      <select
                        onChange={(e) => {
                          const selected = allCars.find(c => c.id === e.target.value);
                          if (selected) onAddCarToCompare(selected);
                        }}
                        defaultValue=""
                        className="bg-luxury-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-400 w-full"
                      >
                        <option value="" disabled>Select vehicle...</option>
                        {availableCars.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.brand} {c.name} ({formatPriceByCurrency(c.price, currentCurrency)})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>

              {/* Comparative Metric Progress Bars */}
              <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Key Benchmark Telemetry Shootout
                </h3>

                {/* Horsepower comparison */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-crimson-500" />
                      Peak Output (Horsepower / BHP)
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Higher is Superior</span>
                  </div>
                  <div className="space-y-2">
                    {comparedCars.map((car) => {
                      const isLeader = car.horsepower === maxHp && comparedCars.length > 1;
                      return (
                        <div key={car.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={`font-medium ${isLeader ? 'text-gold-400 font-bold' : 'text-slate-300'}`}>
                              {car.name} {isLeader && '👑'}
                            </span>
                            <span className="font-mono text-white font-bold">{car.horsepower} BHP</span>
                          </div>
                          <div className="w-full bg-luxury-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isLeader
                                  ? 'bg-gradient-to-r from-gold-400 to-amber-500 shadow-glow-gold'
                                  : 'bg-slate-500'
                              }`}
                              style={{ width: `${(car.horsepower / (maxHp * 1.05)) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 0-100 KM/H Acceleration comparison */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-gold-400" />
                      0 - 100 KM/H Acceleration (Seconds)
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Lower is Faster</span>
                  </div>
                  <div className="space-y-2">
                    {comparedCars.map((car) => {
                      const val = parseFloat(car.acceleration);
                      const isLeader = val === minZeroToSixty && comparedCars.length > 1;
                      return (
                        <div key={car.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={`font-medium ${isLeader ? 'text-gold-400 font-bold' : 'text-slate-300'}`}>
                              {car.name} {isLeader && '⚡ Fastest'}
                            </span>
                            <span className="font-mono text-white font-bold">{car.acceleration}</span>
                          </div>
                          <div className="w-full bg-luxury-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isLeader
                                  ? 'bg-gradient-to-r from-gold-400 to-amber-500 shadow-glow-gold'
                                  : 'bg-slate-500'
                              }`}
                              style={{ width: `${Math.max(15, (4.5 - val) * 40)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Speed comparison */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-electric-400" />
                      Top Speed (V-Max KM/H)
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Higher is Superior</span>
                  </div>
                  <div className="space-y-2">
                    {comparedCars.map((car) => {
                      const isLeader = car.topSpeedNum === maxTopSpeed && comparedCars.length > 1;
                      return (
                        <div key={car.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className={`font-medium ${isLeader ? 'text-gold-400 font-bold' : 'text-slate-300'}`}>
                              {car.name} {isLeader && '🏁 V-Max King'}
                            </span>
                            <span className="font-mono text-white font-bold">{car.topSpeedNum} KM/H</span>
                          </div>
                          <div className="w-full bg-luxury-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isLeader
                                  ? 'bg-gradient-to-r from-electric-400 to-cyan-500 shadow-glow-electric'
                                  : 'bg-slate-500'
                              }`}
                              style={{ width: `${(car.topSpeedNum / (maxTopSpeed * 1.05)) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Full Specs Table Comparison */}
              <div className="overflow-x-auto border border-white/10 rounded-2xl bg-luxury-900/60">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-luxury-900 text-slate-400 uppercase font-medium tracking-wider">
                      <th className="p-4 w-44">Specification</th>
                      {comparedCars.map(c => (
                        <th key={c.id} className="p-4 font-bold text-white min-w-[200px]">
                          {c.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Ex-Showroom Price (India)</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4 font-bold text-gold-400 text-sm font-display">
                          {formatPriceByCurrency(c.price, currentCurrency)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Engine & Configuration</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4">{c.engine}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Transmission</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4">{c.transmission}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Drivetrain</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4">{c.drivetrain}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Fuel / Energy</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4">{c.fuelType}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Curb Weight</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4">{c.curbWeight}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Body Type</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4">{c.bodyType} ({c.doors} doors)</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-semibold text-slate-400 bg-white/[0.02]">Status Location</td>
                      {comparedCars.map(c => (
                        <td key={c.id} className="p-4 text-emerald-400">{c.stockStatus}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>

      </motion.div>

    </motion.div>
  );
}
