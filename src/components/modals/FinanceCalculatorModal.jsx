import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, ShieldCheck, Building2, Check, ArrowRight } from 'lucide-react';
import { CARS_DATA } from '../../data/cars';

const INDIAN_STATES = [
  { id: 'TN', name: 'Tamil Nadu (Chennai / Coimbatore)', rtoRate: 0.15, cess: 0.22 },
  { id: 'KA', name: 'Karnataka (Bengaluru / Mangalore)', rtoRate: 0.18, cess: 0.22 },
  { id: 'MH', name: 'Maharashtra (Mumbai / Pune)', rtoRate: 0.13, cess: 0.22 },
  { id: 'KL', name: 'Kerala (Cochin / Trivandrum)', rtoRate: 0.21, cess: 0.22 },
  { id: 'DL', name: 'Delhi NCR (Aerocity / Gurugram)', rtoRate: 0.125, cess: 0.22 },
  { id: 'TS', name: 'Telangana (Hyderabad)', rtoRate: 0.14, cess: 0.22 }
];

export default function FinanceCalculatorModal({ isOpen, onClose, initialCar = null, onOpenBooking }) {
  const [selectedCarId, setSelectedCarId] = useState(initialCar?.id || CARS_DATA[0].id);
  const [selectedStateCode, setSelectedStateCode] = useState('TN');
  const [activeTab, setActiveTab] = useState('onroad'); // 'onroad' | 'emi' | 'corporate'

  // EMI Sliders
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [loanTenureMonths, setLoanTenureMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(8.65);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const car = useMemo(() => {
    return CARS_DATA.find(c => c.id === selectedCarId) || CARS_DATA[0];
  }, [selectedCarId]);

  const stateData = useMemo(() => {
    return INDIAN_STATES.find(s => s.id === selectedStateCode) || INDIAN_STATES[0];
  }, [selectedStateCode]);

  // Price calculations
  const exShowroom = car.price;
  const rtoTax = Math.round(exShowroom * stateData.rtoRate);
  const tcsTax = Math.round(exShowroom * 0.01); // 1% TCS
  const insuranceAmount = Math.round(exShowroom * 0.032); // ~3.2% Zero-Dep luxury cover
  const handlingReg = 125000; // Registration, High-Security Plates, Fastag & PDI

  const totalOnRoadPrice = exShowroom + rtoTax + tcsTax + insuranceAmount + handlingReg;

  // EMI Calculation: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const downPaymentAmount = Math.round((totalOnRoadPrice * downPaymentPercent) / 100);
  const principalLoan = totalOnRoadPrice - downPaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  
  const monthlyEmi = useMemo(() => {
    if (monthlyRate === 0) return principalLoan / loanTenureMonths;
    const emi = (principalLoan * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) / 
                (Math.pow(1 + monthlyRate, loanTenureMonths) - 1);
    return Math.round(emi);
  }, [principalLoan, monthlyRate, loanTenureMonths]);

  const totalPayment = (monthlyEmi * loanTenureMonths) + downPaymentAmount;
  const totalInterest = totalPayment - totalOnRoadPrice;

  // Corporate Tax Savings under Indian IT Act (Sec 32 Depreciation + GST Input)
  const corporateTaxShield = Math.round(totalOnRoadPrice * 0.3494); // Highest corporate bracket 34.94%

  if (!isOpen) return null;

  const formatLakhCr = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-luxury-950 border border-gold-400/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-luxury-900 to-luxury-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
                  Atelier Financial Desk & On-Road Estimator
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time Indian RTO tax, luxury cess, bespoke financing & corporate lease shields
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            {/* Top Selection Row: Car Selector & State Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Masterpiece Chassis
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors"
                >
                  {CARS_DATA.map((c) => (
                    <option key={c.id} value={c.id} className="bg-luxury-950">
                      {c.name} — {c.priceFormatted}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Registration State / RTO Hub
                </label>
                <select
                  value={selectedStateCode}
                  onChange={(e) => setSelectedStateCode(e.target.value)}
                  className="w-full bg-luxury-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 transition-colors"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-luxury-950">
                      {s.name} ({s.rtoRate * 100}% RTO)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-2">
              <button
                onClick={() => setActiveTab('onroad')}
                className={`pb-3 px-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer relative ${
                  activeTab === 'onroad' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                1. On-Road Breakdown
              </button>
              <button
                onClick={() => setActiveTab('emi')}
                className={`pb-3 px-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer relative ${
                  activeTab === 'emi' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Bespoke Wealth EMI
              </button>
              <button
                onClick={() => setActiveTab('corporate')}
                className={`pb-3 px-4 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer relative ${
                  activeTab === 'corporate' ? 'text-gold-400 border-b-2 border-gold-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                3. Corporate Tax Shield
              </button>
            </div>

            {/* TAB 1: ON-ROAD PRICE BREAKDOWN */}
            {activeTab === 'onroad' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="bg-luxury-900/60 border border-white/10 rounded-2xl p-5 space-y-3.5">
                  <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                    <span className="text-slate-300">Ex-Showroom Price (Incl. 28% GST & 22% Cess)</span>
                    <span className="font-mono font-bold text-white">{formatLakhCr(exShowroom)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      State RTO Road Tax ({stateData.rtoRate * 100}%)
                      <span className="text-[10px] text-gold-400 uppercase">({stateData.id})</span>
                    </span>
                    <span className="font-mono font-medium text-slate-200">{formatLakhCr(rtoTax)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                    <span className="text-slate-300">Comprehensive Multi-Year Zero-Dep Insurance</span>
                    <span className="font-mono font-medium text-slate-200">{formatLakhCr(insuranceAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                    <span className="text-slate-300">TCS (Tax Collected at Source - 1%)</span>
                    <span className="font-mono font-medium text-slate-200">{formatLakhCr(tcsTax)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b border-white/5">
                    <span className="text-slate-300">Registration, Fastag, Logistics & Master PDI</span>
                    <span className="font-mono font-medium text-slate-200">₹1,25,000</span>
                  </div>

                  <div className="pt-3 flex justify-between items-center text-base sm:text-lg font-bold border-t border-gold-400/30">
                    <span className="text-gold-400 uppercase tracking-wider">Total On-Road Estimated ({stateData.id})</span>
                    <span className="text-2xl font-display font-extrabold text-gold-400 font-mono">
                      {formatLakhCr(totalOnRoadPrice)}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gold-400/5 border border-gold-400/20 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <p>
                    All allocations cleared directly via Aureus Veloce India under complete factory warranty, 3-year scheduled maintenance package, and Pan-India enclosed hydraulic transport direct to your residence.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LUXURY EMI CALCULATOR */}
            {activeTab === 'emi' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-luxury-900/60 border border-white/10 rounded-2xl p-5">
                  {/* Down payment */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Down Payment ({downPaymentPercent}%)</span>
                      <span className="text-gold-400 font-mono">{formatLakhCr(downPaymentAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="75"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-gold-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>15%</span>
                      <span>50%</span>
                      <span>75%</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Tenure</span>
                      <span className="text-gold-400 font-mono">{loanTenureMonths} Months ({loanTenureMonths / 12} Yrs)</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="84"
                      step="12"
                      value={loanTenureMonths}
                      onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                      className="w-full accent-gold-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>1 Yr</span>
                      <span>4 Yrs</span>
                      <span>7 Yrs</span>
                    </div>
                  </div>

                  {/* Interest rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Private Bank Rate</span>
                      <span className="text-gold-400 font-mono">{interestRate}% p.a.</span>
                    </div>
                    <input
                      type="range"
                      min="7.25"
                      max="11.5"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full accent-gold-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>7.25%</span>
                      <span>9.0%</span>
                      <span>11.5%</span>
                    </div>
                  </div>
                </div>

                {/* Output Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-luxury-900 border border-gold-400/30 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                      Estimated Monthly Outflow
                    </span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400">
                      ₹{monthlyEmi.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">per month</span>
                  </div>

                  <div className="p-4 rounded-xl bg-luxury-900 border border-white/10 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                      Principal Financed
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">
                      {formatLakhCr(principalLoan)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Loan amount</span>
                  </div>

                  <div className="p-4 rounded-xl bg-luxury-900 border border-white/10 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                      Total Interest Accrued
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-slate-300">
                      {formatLakhCr(totalInterest)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">over {loanTenureMonths / 12} years</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-luxury-900/40 border border-white/10 text-xs text-slate-300">
                  <span>Structured through HDFC Private Wealth, Kotak Mahindra Wealth, or ICICI Private Banking</span>
                  <span className="text-gold-400 font-semibold uppercase">Zero Prepayment Penalty</span>
                </div>
              </motion.div>
            )}

            {/* TAB 3: CORPORATE LEASE & TAX SHIELD */}
            {activeTab === 'corporate' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div className="p-6 rounded-2xl bg-luxury-900/60 border border-gold-400/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-gold-400" />
                    <div>
                      <h4 className="text-base font-bold text-white">Corporate Capital Shield & Lease Advantage</h4>
                      <p className="text-xs text-slate-400">Section 32 of Indian Income Tax Act (Depreciation on Commercial Fleet)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Estimated Corporate Tax Shield (34.94%)
                      </span>
                      <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                        {formatLakhCr(corporateTaxShield)}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Deductible across 3-year corporate operating lease rentals against taxable enterprise profits.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                        Effective Net Acquisition Outlay
                      </span>
                      <span className="text-xl sm:text-2xl font-bold font-mono text-gold-400 mt-1 block">
                        {formatLakhCr(totalOnRoadPrice - corporateTaxShield)}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Post-depreciation net cost to your corporation or family office trust.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gold-400" />
                    <span>Off-balance sheet operating lease structures tailored for listed promoter offices.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gold-400" />
                    <span>Complete fuel, fleet maintenance, and insurance bundled in a single deductible monthly invoice.</span>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Footer CTAs */}
          <div className="p-5 sm:p-6 border-t border-white/10 bg-luxury-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              <span>Selected: </span>
              <strong className="text-white">{car.name}</strong> • 
              <span className="text-gold-400"> {formatLakhCr(totalOnRoadPrice)} ({stateData.id} On-Road)</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenBooking) onOpenBooking(car);
                }}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Request Financial Dossier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
