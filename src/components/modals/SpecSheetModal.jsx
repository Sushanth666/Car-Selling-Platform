import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import AureusLogo from '../common/AureusLogo';
import { formatPriceByCurrency } from '../../utils/currency';

export default function SpecSheetModal({ isOpen, onClose, car, activeColor, currentCurrency = "INR" }) {
  if (!isOpen || !car) return null;

  const currentColor = activeColor || car.defaultColour || car.availableColours?.[0] || {
    name: 'Atelier Signature Spec',
    hex: '#D91424'
  };

  const handlePrint = () => {
    window.print();
  };

  const chassisSuffix = ((car.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 9000) + 1000);
  const chassisId = `IND-APX-${car.year || 2026}-${car.id.slice(0, 4).toUpperCase()}-${chassisSuffix}`;
  const certHash = `APX-${(car.price || 99999).toString(16).toUpperCase()}-${car.id.slice(0, 6).toUpperCase()}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:m-0 print:static">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md print:hidden"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-luxury-950 border-2 border-gold-400/50 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden z-10 my-auto text-white print:border-none print:shadow-none print:w-full print:max-w-none print:rounded-none print:bg-white print:text-black"
        >
          {/* Header Action Bar (Hidden on print) */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-luxury-900 print:hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs uppercase tracking-widest font-bold text-gold-400">
                Official Atelier Monroney Specification Certificate
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-full bg-gold-400 hover:bg-gold-300 text-luxury-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-glow-gold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PRINTABLE MONRONEY WINDOW STICKER BODY */}
          <div className="p-6 sm:p-10 space-y-8 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-8">
            
            {/* Top Certificate Header */}
            <div className="border-b-2 border-gold-400/40 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <AureusLogo layout="horizontal" size="sm" showTagline={false} />
                  <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded bg-gold-400/20 text-gold-400 border border-gold-400/40 font-bold">
                    Official Monroney
                  </span>
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-1 uppercase tracking-wider">
                  The Sovereign Kinetic • Certified Right-Hand Drive (RHD) Provenance Escrow
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-white/15 sm:pl-6 print:border-black/20">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-600 block">Chassis Verification ID</span>
                <span className="font-mono text-sm font-bold text-gold-400 print:text-black">{chassisId}</span>
              </div>
            </div>

            {/* Car Name & Visual Spec Overview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                  {car.year} • {car.brand} Bespoke Collection
                </span>
                <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white print:text-black">
                  {car.name}
                </h2>
                <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
                  {car.engine} producing {car.horsepower} PS. Hand-assembled at {car.brand} factory under exclusive Indian allocation privileges.
                </p>

                {/* Selected Color Pill */}
                <div className="pt-2 flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md flex-shrink-0"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <div className="text-xs">
                    <span className="text-slate-400 print:text-slate-600 uppercase tracking-wider text-[10px] block">Factory Finish:</span>
                    <strong className="text-white print:text-black">{currentColor.name}</strong>
                  </div>
                </div>
              </div>

              {/* Masterpiece Photo */}
              <div className="md:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-gold-400/30 shadow-xl bg-luxury-900 print:border-black">
                  <img
                    src={currentColor.image || car.defaultImage}
                    alt={car.name}
                    className="w-full h-44 object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specification Matrix */}
            <div className="border border-white/10 print:border-black rounded-2xl overflow-hidden">
              <div className="bg-luxury-900/80 print:bg-slate-100 px-5 py-3 border-b border-white/10 print:border-black flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-gold-400 print:text-black">
                  Factory Telemetry & Mechanical Architecture
                </span>
                <span className="text-[11px] font-mono text-slate-400 print:text-slate-600">Metric Spec</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 text-xs bg-luxury-950/40 print:bg-white">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Powertrain</span>
                  <span className="font-semibold text-white print:text-black">{car.engine}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Peak Output</span>
                  <span className="font-semibold text-gold-400 font-mono">{car.horsepower} Horsepower</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">0–100 km/h</span>
                  <span className="font-semibold text-gold-400 font-mono">{car.acceleration}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Top Velocity</span>
                  <span className="font-semibold text-white print:text-black font-mono">{car.topSpeed}</span>
                </div>
                <div className="space-y-1 pt-3 border-t border-white/5 print:border-black/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Transmission</span>
                  <span className="font-semibold text-white print:text-black">{car.transmission}</span>
                </div>
                <div className="space-y-1 pt-3 border-t border-white/5 print:border-black/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Drivetrain</span>
                  <span className="font-semibold text-white print:text-black">{car.drivetrain}</span>
                </div>
                <div className="space-y-1 pt-3 border-t border-white/5 print:border-black/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Curb Weight</span>
                  <span className="font-semibold text-white print:text-black">{car.curbWeight}</span>
                </div>
                <div className="space-y-1 pt-3 border-t border-white/5 print:border-black/10">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Seating Config</span>
                  <span className="font-semibold text-white print:text-black">{car.doors} Doors • {car.seats} Seats</span>
                </div>
              </div>
            </div>

            {/* Provenance Escrow & Flagship Atelier Stamp */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-gold-400/5 print:bg-slate-50 border border-gold-400/20 print:border-black">
              <div className="sm:col-span-8 space-y-1.5 text-xs text-slate-300 print:text-slate-700">
                <div className="flex items-center gap-2 text-gold-400 print:text-black font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aureus Veloce India 150-Point Sovereign Provenance Seal</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Guaranteed matching engine and transmission numbers, zero structural compromise, clean customs title clearance (HSN 8703), and lifetime buyback eligibility across Mumbai BKC, Bengaluru UB City, Chennai, Cochin, and Delhi Aerocity.
                </p>
              </div>

              <div className="sm:col-span-4 text-right flex flex-col items-end border-t sm:border-t-0 sm:border-l border-white/10 print:border-black/20 pt-4 sm:pt-0 sm:pl-6">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 print:text-slate-600 block">Ex-Showroom Valuation</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400 print:text-black">
                  {formatPriceByCurrency(car.price, currentCurrency)}
                </span>
                <span className="text-[9px] text-slate-400 print:text-slate-500 uppercase tracking-wider">
                  Plus applicable State RTO
                </span>
              </div>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-4 border-t border-white/10 print:border-black flex items-center justify-between text-[10px] text-slate-400 print:text-slate-600 font-mono">
              <span>AUTHORIZED SIGNATURE: AUREUS VELOCE CURATOR DESK</span>
              <span>CERTIFICATE HASH: {certHash}</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
