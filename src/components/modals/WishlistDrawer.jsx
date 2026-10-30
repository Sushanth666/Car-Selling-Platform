import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Trash2, Calendar, Scale, Sparkles } from 'lucide-react';
import { formatPriceByCurrency } from '../../utils/currency';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistCars,
  onRemoveFromWishlist,
  onClearWishlist,
  onOpenCompareWithCars,
  onBookTestDrive,
  onInspectCar,
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

  const totalValuation = wishlistCars.reduce((sum, car) => sum + (car.price || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end"
    >
      
      {/* Background click-off overlay */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Slide-out Drawer Panel with Framer Motion */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md bg-luxury-950 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl"
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-luxury-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-crimson-600/20 text-crimson-500 border border-crimson-500/30">
              <Heart className="w-5 h-5 fill-crimson-500" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                Dream Garage
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold-400 text-luxury-950 font-sans font-bold">
                  {wishlistCars.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Curated Favorites & Private Allocations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Valuation Bar */}
        {wishlistCars.length > 0 && (
          <div className="px-6 py-3.5 bg-gradient-to-r from-luxury-900 via-luxury-850 to-luxury-900 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="text-xs text-slate-300">Total Garage Valuation:</span>
            </div>
            <span className="text-base font-display font-extrabold text-gold-400">
              {formatPriceByCurrency(totalValuation, currentCurrency)}
            </span>
          </div>
        )}

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistCars.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Heart className="w-16 h-16 text-slate-700 mx-auto stroke-1" />
              <h3 className="text-lg font-display font-semibold text-white">Your Garage is Empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tap the heart icon on any supercar to curate your personal dream collection.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-gold-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold hover:bg-gold-500 transition-all cursor-pointer"
              >
                Explore Fleet
              </button>
            </div>
          ) : (
            wishlistCars.map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group relative glass-card rounded-2xl p-3 border border-white/10 flex gap-4 hover:border-gold-400/40 transition-all"
              >
                {/* Car Thumbnail */}
                <div
                  className="w-24 h-20 rounded-xl overflow-hidden bg-luxury-900 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onInspectCar(car);
                  }}
                >
                  <img src={car.heroImage} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium truncate">{car.brand}</p>
                    <h4
                      onClick={() => {
                        onClose();
                        onInspectCar(car);
                      }}
                      className="text-xs font-bold text-white hover:text-gold-400 transition-colors cursor-pointer truncate"
                    >
                      {car.name}
                    </h4>
                    <p className="text-xs font-display font-bold text-gold-400 mt-0.5">
                      {formatPriceByCurrency(car.price, currentCurrency)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onBookTestDrive(car);
                      }}
                      className="text-[11px] text-slate-300 hover:text-gold-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3 h-3 text-gold-400" />
                      <span>Test Drive</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(car.id)}
                      className="p-1 rounded text-slate-500 hover:text-crimson-400 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {wishlistCars.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-luxury-900/60 backdrop-blur-md space-y-2.5">
            {wishlistCars.length >= 2 && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCompareWithCars(wishlistCars.slice(0, 4));
                }}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4 text-gold-400" />
                <span>Compare Saved Fleet ({Math.min(4, wishlistCars.length)})</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onBookTestDrive(wishlistCars[0]);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-luxury-950 font-bold text-xs uppercase tracking-wider shadow-glow-gold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Concierge Preview</span>
            </button>

            <button
              onClick={onClearWishlist}
              className="w-full text-center text-[11px] text-slate-500 hover:text-crimson-400 pt-1 transition-colors cursor-pointer"
            >
              Clear all saved cars
            </button>
          </div>
        )}

      </motion.div>

    </motion.div>
  );
}
