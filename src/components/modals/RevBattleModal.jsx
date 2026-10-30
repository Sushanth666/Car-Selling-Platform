import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Zap } from 'lucide-react';

const SOUNDBOARD_CARS = [
  {
    id: 'porsche-911-gt3-rs',
    engineTag: '9,000 RPM Flat-6 NA',
    name: 'Porsche 911 GT3 RS',
    soundDesc: 'Naturally Aspirated Boxer-6 shrieking to 9,000 RPM with titanium exhaust',
    audio: '/audio/porsche-911-gt3-rs.ogg',
    redline: 9000,
    flameColor: '#f97316'
  },
  {
    id: 'bugatti-chiron-pur-sport',
    engineTag: '8.0L Quad-Turbo W16',
    name: 'Bugatti Chiron Pur Sport',
    soundDesc: '16 cylinders of thunderous quad-turbo induction howl and wastegate chatter',
    audio: '/audio/bugatti-chiron.ogg',
    redline: 6900,
    flameColor: '#06b6d4'
  },
  {
    id: 'ferrari-sf90-stradale',
    engineTag: '4.0L Twin-Turbo V8 Hybrid',
    name: 'Ferrari SF90 Stradale',
    soundDesc: 'Maranello flat-plane crank V8 with instant electric boost spool',
    audio: '/audio/ferrari-sf90.ogg',
    redline: 8000,
    flameColor: '#ef4444'
  },
  {
    id: 'lamborghini-revuelto',
    engineTag: '6.5L Naturally Aspirated V12',
    name: 'Lamborghini Revuelto',
    soundDesc: 'Symphonic Sant’Agata high-compression naturally aspirated V12 fury',
    audio: '/audio/lamborghini-revuelto.ogg',
    redline: 9500,
    flameColor: '#eab308'
  },
  {
    id: 'koenigsegg-jesko',
    engineTag: '5.0L Flat-Plane V8 Megacar',
    name: 'Koenigsegg Jesko Attack',
    soundDesc: 'World’s lightest V8 crankshaft screaming with 1,600 horsepower boost',
    audio: '/audio/koenigsegg-jesko.ogg',
    redline: 8500,
    flameColor: '#a855f7'
  },
  {
    id: 'rolls-royce-cullinan',
    engineTag: '6.75L Twin-Turbo V12',
    name: 'Rolls-Royce Cullinan V12',
    soundDesc: 'Deep, commanding Goodwood V12 subterranean baritone rumble',
    audio: '/audio/rolls-royce-cullinan.ogg',
    redline: 5500,
    flameColor: '#94a3b8'
  }
];

export default function RevBattleModal({ isOpen, onClose }) {
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [isPedalPressed, setIsPedalPressed] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(850);

  const audioRef = useRef(null);
  const rpmIntervalRef = useRef(null);

  const activeProfile = SOUNDBOARD_CARS[activeCarIndex] || SOUNDBOARD_CARS[0];

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleClose = () => {
    stopAudio();
    setIsPedalPressed(false);
    setCurrentRpm(850);
    onClose();
  };

  const handleSelectCar = (idx) => {
    stopAudio();
    setIsPedalPressed(false);
    setCurrentRpm(850);
    setActiveCarIndex(idx);
  };

  const handlePedalRelease = () => {
    setIsPedalPressed(false);
    stopAudio();
    setCurrentRpm(850);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopAudio();
        setIsPedalPressed(false);
        setCurrentRpm(850);
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAudio();
      if (rpmIntervalRef.current) {
        clearInterval(rpmIntervalRef.current);
      }
    };
  }, [isOpen, onClose]);

  // Handle pedal press & hold
  useEffect(() => {
    if (!isPedalPressed) return;

    // Play audio
    if (!audioRef.current || audioRef.current.src !== window.location.origin + activeProfile.audio) {
      audioRef.current = new Audio(activeProfile.audio);
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch(() => {});

    // Ramp up RPM
    rpmIntervalRef.current = setInterval(() => {
      setCurrentRpm((prev) => {
        const step = Math.round((activeProfile.redline - 850) / 18);
        const next = prev + step;
        return next >= activeProfile.redline ? activeProfile.redline - Math.floor(Math.random() * 250) : next;
      });
    }, 50);

    return () => {
      stopAudio();
      if (rpmIntervalRef.current) {
        clearInterval(rpmIntervalRef.current);
      }
    };
  }, [isPedalPressed, activeProfile]);

  if (!isOpen) return null;

  // Tachometer angle calculation (-120deg at 0 RPM to +120deg at max RPM)
  const rpmPercent = (currentRpm - 850) / (activeProfile.redline - 850);
  const needleAngle = -120 + rpmPercent * 240;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-luxury-950 border border-gold-400/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-luxury-900 to-luxury-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
                <Flame className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
                  Atelier Exhaust Sound Lounge & Rev Arena
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive accelerator pedal, dynamic tachometer redline & authentic acoustic telemetry
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            {/* Powertrain Class Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {SOUNDBOARD_CARS.map((profile, idx) => {
                const isActive = activeCarIndex === idx;
                return (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectCar(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gold-400/15 border-gold-400 shadow-glow-gold'
                        : 'bg-luxury-900/50 border-white/10 hover:border-white/25 hover:bg-luxury-900'
                    }`}
                  >
                    <span className={`text-[9px] uppercase tracking-wider font-bold block mb-1 truncate ${
                      isActive ? 'text-gold-400' : 'text-slate-400'
                    }`}>
                      {profile.engineTag}
                    </span>
                    <span className="text-xs font-bold text-white block truncate">
                      {profile.name.split(' ')[0]} {profile.name.split(' ')[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Arena: Tachometer & Rev Control */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-black/80 to-luxury-900/80 border border-white/15 relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-8">
              
              {/* Tachometer Display */}
              <div className="relative flex flex-col items-center">
                <div className="relative w-56 h-56 rounded-full border-4 border-white/10 bg-luxury-950/90 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
                  
                  {/* Gauge Arc Ticks */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle
                      cx="112"
                      cy="112"
                      r="96"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="450"
                      strokeDashoffset="120"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="96"
                      stroke={currentRpm > activeProfile.redline * 0.85 ? '#ef4444' : '#eab308'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="450"
                      strokeDashoffset={450 - (rpmPercent * 330)}
                      className="transition-all duration-75"
                    />
                  </svg>

                  {/* Needle */}
                  <div
                    style={{ transform: `rotate(${needleAngle}deg)` }}
                    className="absolute w-1 h-24 bg-gradient-to-t from-red-500 to-gold-400 rounded-full origin-bottom bottom-28 transition-transform duration-75 shadow-[0_0_10px_#ef4444]"
                  />

                  {/* Center Hub & Digital RPM */}
                  <div className="relative z-10 w-24 h-24 rounded-full bg-luxury-900 border-2 border-gold-400/40 flex flex-col items-center justify-center text-center shadow-lg">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">RPM</span>
                    <span className="text-xl font-bold font-mono text-gold-400">
                      {currentRpm.toLocaleString()}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono">
                      MAX {activeProfile.redline}
                    </span>
                  </div>

                  {/* Flame exhaust visual if high RPM */}
                  {currentRpm > activeProfile.redline * 0.8 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute -bottom-4 w-12 h-12 rounded-full blur-md animate-ping"
                      style={{ backgroundColor: activeProfile.flameColor }}
                    />
                  )}
                </div>

                {/* Sound description */}
                <p className="text-xs text-slate-300 text-center max-w-xs mt-3 leading-relaxed">
                  {activeProfile.soundDesc}
                </p>
              </div>

              {/* Interactive Gas Pedal & Instructions */}
              <div className="flex flex-col items-center gap-4">
                
                {/* Visual Audio Frequency Equalizer */}
                <div className="flex items-end gap-1.5 h-12 px-4 py-2 bg-black/60 rounded-xl border border-white/10">
                  {[20, 45, 75, 90, 60, 85, 95, 70, 50, 80, 100, 65, 40].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: isPedalPressed ? `${Math.min(h * (currentRpm / 5000), 100)}%` : '15%',
                        backgroundColor: isPedalPressed ? (i > 8 ? '#ef4444' : '#eab308') : '#475569'
                      }}
                      className="w-1.5 rounded-full transition-all duration-100"
                    />
                  ))}
                </div>

                {/* THE GAS PEDAL (Press & Hold) */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    onMouseDown={() => setIsPedalPressed(true)}
                    onMouseUp={handlePedalRelease}
                    onMouseLeave={handlePedalRelease}
                    onTouchStart={() => setIsPedalPressed(true)}
                    onTouchEnd={handlePedalRelease}
                    className={`relative w-28 h-44 rounded-2xl border-4 transition-all duration-150 select-none cursor-pointer flex flex-col items-center justify-between p-3.5 ${
                      isPedalPressed
                        ? 'bg-gradient-to-b from-amber-600 to-amber-700 border-gold-400 translate-y-3 shadow-[0_5px_30px_rgba(234,179,8,0.6)] scale-95'
                        : 'bg-gradient-to-b from-zinc-800 to-zinc-950 border-zinc-600 hover:border-gold-400/60 shadow-[0_15px_30px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {/* Metal tread stripes */}
                    <div className="w-full space-y-2">
                      <div className="h-1.5 bg-black/60 rounded-full" />
                      <div className="h-1.5 bg-black/60 rounded-full" />
                      <div className="h-1.5 bg-black/60 rounded-full" />
                      <div className="h-1.5 bg-black/60 rounded-full" />
                    </div>

                    <div className="text-center">
                      <Zap className={`w-5 h-5 mx-auto mb-1 ${isPedalPressed ? 'text-white animate-bounce' : 'text-gold-400'}`} />
                      <span className={`text-[10px] uppercase font-bold tracking-widest block ${
                        isPedalPressed ? 'text-white' : 'text-slate-300'
                      }`}>
                        {isPedalPressed ? 'REV WOT!' : 'PRESS & HOLD'}
                      </span>
                    </div>

                    <div className="w-full flex justify-center">
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-mono">Billet Aluminum</span>
                    </div>
                  </button>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Click & Hold to push to redline
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="p-5 sm:p-6 border-t border-white/10 bg-luxury-950 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              High-definition uncompressed acoustic mastering recorded at Nürburgring & Fiorano test facilities.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Exit Sound Lounge
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
