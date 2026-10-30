import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Zap, Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { CARS_DATA } from '../../data/cars';

export default function DragRaceModal({ isOpen, onClose, initialCar1 = null }) {
  const [car1Id, setCar1Id] = useState(initialCar1?.id || 'ferrari-sf90-stradale');
  const [car2Id, setCar2Id] = useState('porsche-911-gt3-rs');

  // Race States: 'idle' | 'countdown' | 'racing' | 'finished'
  const [raceState, setRaceState] = useState('idle');
  const [countdownStep, setCountdownStep] = useState(0); // 0: off, 1: red, 2: yellow, 3: green
  const [car1Progress, setCar1Progress] = useState(0); // 0 to 100%
  const [car2Progress, setCar2Progress] = useState(0); // 0 to 100%
  const [car1Speed, setCar1Speed] = useState(0);
  const [car2Speed, setCar2Speed] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const activeAudioRef = useRef(null);
  const animationFrameRef = useRef(null);

  const car1 = useMemo(() => CARS_DATA.find(c => c.id === car1Id) || CARS_DATA[0], [car1Id]);
  const car2 = useMemo(() => CARS_DATA.find(c => c.id === car2Id) || CARS_DATA[1], [car2Id]);

  // Audio helper
  const playSound = (audioPath) => {
    if (isMuted || !audioPath) return;
    try {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      const audio = new Audio(audioPath);
      audio.volume = 0.6;
      audio.play().catch(() => {});
      activeAudioRef.current = audio;
      return audio;
    } catch {
      return null;
    }
  };

  const stopAnimationAndAudio = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (activeAudioRef.current) activeAudioRef.current.pause();
  };

  const resetRace = () => {
    stopAnimationAndAudio();
    setRaceState('idle');
    setCountdownStep(0);
    setCar1Progress(0);
    setCar2Progress(0);
    setCar1Speed(0);
    setCar2Speed(0);
    setWinner(null);
  };

  const handleClose = () => {
    resetRace();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAnimationAndAudio();
    };
  }, [isOpen]);

  const startRace = () => {
    if (raceState !== 'idle') return;
    setRaceState('countdown');
    setCountdownStep(1);

    // Audio cue
    playSound(car1.audio || '/audio/supercar-exhaust-rev.ogg');

    setTimeout(() => {
      setCountdownStep(2);
      setTimeout(() => {
        setCountdownStep(3); // GREEN GO!
        setTimeout(() => {
          setRaceState('racing');
          runDragSimulation();
        }, 500);
      }, 700);
    }, 700);
  };

  const runDragSimulation = () => {
    // 0-100 time in seconds
    const time1 = car1.accelerationNum || 3.0;
    const time2 = car2.accelerationNum || 3.0;

    // Relative speed factor (higher acceleration = faster progress)
    // Quarter mile simulation over ~4.5 seconds of visual animation
    const raceDurationMs = 4500;
    const startTime = performance.now();

    const updateFrame = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / raceDurationMs, 1);

      // Quadratic acceleration physics curve
      const p1 = Math.min(Math.pow(t, (time1 / 3.0) * 0.9) * 100, 100);
      const p2 = Math.min(Math.pow(t, (time2 / 3.0) * 0.9) * 100, 100);

      setCar1Progress(p1);
      setCar2Progress(p2);

      // Speed calculation up to top speed
      const targetSpeed1 = Math.round(t * Math.min(car1.topSpeedNum, 260));
      const targetSpeed2 = Math.round(t * Math.min(car2.topSpeedNum, 260));
      setCar1Speed(targetSpeed1);
      setCar2Speed(targetSpeed2);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(updateFrame);
      } else {
        // Finished
        setRaceState('finished');
        if (time1 < time2) {
          setWinner(car1);
        } else if (time2 < time1) {
          setWinner(car2);
        } else {
          setWinner(car1.topSpeedNum >= car2.topSpeedNum ? car1 : car2);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-5xl bg-luxury-950 border border-gold-400/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-luxury-900 to-luxury-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2">
                  Aureus Drag Strip • 0–100 km/h Head-to-Head
                </h3>
                <p className="text-xs text-slate-400">
                  Telemetry battle simulator with launch control physics & quarter-mile split times
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-gold-400 flex items-center justify-center transition-colors cursor-pointer"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6 max-h-[78vh] overflow-y-auto custom-scrollbar">
            
            {/* Fighter Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Lane 1 Fighter */}
              <div className="p-4 rounded-2xl bg-luxury-900/60 border border-gold-400/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 px-2.5 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/20">
                    Lane 1 • Left Track
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    0-100: <strong className="text-gold-400">{car1.acceleration}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={car1.defaultImage}
                    alt={car1.name}
                    className="w-24 h-16 object-cover rounded-xl border border-white/10"
                  />
                  <div className="flex-1">
                    <select
                      value={car1Id}
                      onChange={(e) => {
                        setCar1Id(e.target.value);
                        resetRace();
                      }}
                      disabled={raceState !== 'idle'}
                      className="w-full bg-luxury-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-gold-400 transition-colors"
                    >
                      {CARS_DATA.map((c) => (
                        <option key={c.id} value={c.id} className="bg-luxury-950">
                          {c.name} ({c.acceleration})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                      <span>{car1.horsepower} HP</span>
                      <span>•</span>
                      <span>{car1.topSpeed}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lane 2 Fighter */}
              <div className="p-4 rounded-2xl bg-luxury-900/60 border border-white/15 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                    Lane 2 • Right Track
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    0-100: <strong className="text-white">{car2.acceleration}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={car2.defaultImage}
                    alt={car2.name}
                    className="w-24 h-16 object-cover rounded-xl border border-white/10"
                  />
                  <div className="flex-1">
                    <select
                      value={car2Id}
                      onChange={(e) => {
                        setCar2Id(e.target.value);
                        resetRace();
                      }}
                      disabled={raceState !== 'idle'}
                      className="w-full bg-luxury-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-gold-400 transition-colors"
                    >
                      {CARS_DATA.map((c) => (
                        <option key={c.id} value={c.id} className="bg-luxury-950">
                          {c.name} ({c.acceleration})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                      <span>{car2.horsepower} HP</span>
                      <span>•</span>
                      <span>{car2.topSpeed}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Christmas Tree Countdown & Launch Area */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              
              {/* Christmas Tree Stage Lights */}
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border border-white/20 transition-all duration-200 ${
                  countdownStep >= 1 ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-red-950/40 opacity-30'
                }`} />
                <div className={`w-6 h-6 rounded-full border border-white/20 transition-all duration-200 ${
                  countdownStep >= 2 ? 'bg-amber-400 shadow-[0_0_15px_#f59e0b]' : 'bg-amber-950/40 opacity-30'
                }`} />
                <div className={`w-8 h-8 rounded-full border-2 border-white/30 transition-all duration-200 ${
                  countdownStep >= 3 ? 'bg-emerald-400 shadow-[0_0_25px_#10b981] scale-110' : 'bg-emerald-950/40 opacity-30'
                }`} />
              </div>

              {/* Status Message */}
              <div className="text-center">
                {raceState === 'idle' && (
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">
                    Ready on Start Line • Staged
                  </span>
                )}
                {raceState === 'countdown' && (
                  <span className="text-sm uppercase tracking-widest text-amber-400 font-bold font-mono animate-pulse">
                    Spooling Turbos • Launch Control Active...
                  </span>
                )}
                {raceState === 'racing' && (
                  <span className="text-sm uppercase tracking-widest text-emerald-400 font-bold font-mono">
                    WOT FULL THROTTLE • 400M DRAG IN PROGRESS
                  </span>
                )}
                {raceState === 'finished' && (
                  <span className="text-sm uppercase tracking-widest text-gold-400 font-bold font-mono flex items-center gap-2 justify-center">
                    <Trophy className="w-4 h-4 text-gold-400" />
                    <span>CHECKERED FLAG • VICTORY CLAIMED</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {raceState === 'idle' ? (
                  <button
                    onClick={startRace}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 hover:from-gold-300 hover:to-amber-400 text-luxury-950 font-bold text-xs uppercase tracking-widest shadow-glow-gold hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Engage Launch Control</span>
                  </button>
                ) : (
                  <button
                    onClick={resetRace}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Staging Line</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drag Strip Animation Lanes */}
            <div className="space-y-4 bg-luxury-900/80 p-5 rounded-2xl border border-white/10 relative overflow-hidden">
              
              {/* Finish Line Marker */}
              <div className="absolute right-8 top-0 bottom-0 w-2.5 bg-[repeating-linear-gradient(45deg,#fff,#fff_6px,#000_6px,#000_12px)] opacity-60 z-10 pointer-events-none" />

              {/* Lane 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gold-400 flex items-center gap-1.5">
                    <span>{car1.name}</span>
                    {winner?.id === car1.id && raceState === 'finished' && (
                      <span className="text-[10px] bg-gold-400/20 text-gold-400 px-2 py-0.2 rounded-full border border-gold-400/30">
                        WINNER 👑
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-slate-300 text-xs">
                    {car1Speed} km/h • <span className="text-gold-400 font-bold">{car1Progress.toFixed(0)}%</span>
                  </span>
                </div>

                <div className="h-14 rounded-xl bg-black/60 border border-white/10 relative flex items-center px-2 overflow-hidden">
                  {/* Asphalt center dashed line */}
                  <div className="absolute left-0 right-0 h-0.5 border-b border-dashed border-white/20" />

                  {/* Car Avatar */}
                  <motion.div
                    style={{ left: `calc(${car1Progress}% - 70px)` }}
                    className="absolute flex items-center gap-2 z-20"
                  >
                    <div className="relative">
                      <img
                        src={car1.defaultImage}
                        alt={car1.name}
                        className="w-16 h-10 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                      />
                      {raceState === 'racing' && (
                        <div className="absolute -left-3 top-3 w-4 h-2 bg-gradient-to-l from-orange-500 to-transparent blur-xs animate-ping" />
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Lane 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>{car2.name}</span>
                    {winner?.id === car2.id && raceState === 'finished' && (
                      <span className="text-[10px] bg-emerald-400/20 text-emerald-400 px-2 py-0.2 rounded-full border border-emerald-400/30">
                        WINNER 👑
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-slate-300 text-xs">
                    {car2Speed} km/h • <span className="text-white font-bold">{car2Progress.toFixed(0)}%</span>
                  </span>
                </div>

                <div className="h-14 rounded-xl bg-black/60 border border-white/10 relative flex items-center px-2 overflow-hidden">
                  <div className="absolute left-0 right-0 h-0.5 border-b border-dashed border-white/20" />

                  <motion.div
                    style={{ left: `calc(${car2Progress}% - 70px)` }}
                    className="absolute flex items-center gap-2 z-20"
                  >
                    <div className="relative">
                      <img
                        src={car2.defaultImage}
                        alt={car2.name}
                        className="w-16 h-10 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                      />
                      {raceState === 'racing' && (
                        <div className="absolute -left-3 top-3 w-4 h-2 bg-gradient-to-l from-cyan-400 to-transparent blur-xs animate-ping" />
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>

            {/* Victory Podium Card */}
            {raceState === 'finished' && winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl bg-gradient-to-r from-gold-500/10 via-luxury-900 to-gold-500/10 border border-gold-400/40 text-center space-y-2"
              >
                <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Aureus Quarter-Mile Champion</span>
                </div>
                <h4 className="text-xl font-display font-extrabold text-white">
                  {winner.name} wins by {(Math.abs(car1.accelerationNum - car2.accelerationNum)).toFixed(2)}s!
                </h4>
                <p className="text-xs text-slate-300 max-w-xl mx-auto">
                  Powered by {winner.engine} producing {winner.horsepower} HP, reaching 0-100 km/h in an astonishing {winner.acceleration}.
                </p>
              </motion.div>
            )}

          </div>

          {/* Footer */}
          <div className="p-5 sm:p-6 border-t border-white/10 bg-luxury-950 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Simulated under standard atmospheric conditions (25°C sea level, Michelin Pilot Sport Cup 2 R compound).
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Close Simulator
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
