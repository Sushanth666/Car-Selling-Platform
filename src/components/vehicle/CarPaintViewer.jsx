import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { recolorCarImage } from '../../utils/paintEngine';

export default function CarPaintViewer({
  car,
  selectedColor,
  className = "w-full h-full object-cover",
  alt,
  priority = false,
  showShimmer = true
}) {
  const baseSrc = car.defaultImage || car.heroImage;
  const activeColor = selectedColor || car.defaultColour || car.colors?.[0];

  const dedicatedImage = activeColor?.image || car.colourImages?.[activeColor?.name];
  const isDefaultColor = activeColor?.name === (car.defaultColour?.name || car.colors?.[0]?.name);
  const directSrc = dedicatedImage || (isDefaultColor ? baseSrc : null);

  const [canvasRecoloredSrc, setCanvasRecoloredSrc] = useState(null);
  const imgRef = useRef(null);

  const currentDisplaySrc = directSrc || canvasRecoloredSrc || baseSrc;
  const isProcessing = !directSrc && Boolean(activeColor?.hex) && !canvasRecoloredSrc;

  // When selectedColor changes and requires canvas recoloring
  useEffect(() => {
    if (directSrc || !activeColor?.hex) return;

    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = baseSrc;

    img.onload = () => {
      if (isCancelled) return;
      const recoloredDataUrl = recolorCarImage(
        img, 
        activeColor.hex, 
        activeColor.finish || "Metallic", 
        0.9
      );
      if (recoloredDataUrl && !isCancelled) {
        setCanvasRecoloredSrc(recoloredDataUrl);
      }
    };

    return () => {
      isCancelled = true;
    };
  }, [directSrc, activeColor?.hex, activeColor?.finish, baseSrc]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-luxury-900">
      {/* Primary Car Image with Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.img
          key={`${car.id}_${activeColor?.name || 'default'}`}
          ref={imgRef}
          src={currentDisplaySrc}
          alt={alt || `${car.name} in ${activeColor?.name || 'Default'}`}
          initial={{ opacity: 0.88, filter: "brightness(0.95)" }}
          animate={{ opacity: 1, filter: "brightness(1.0)" }}
          exit={{ opacity: 0.88 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={className}
          loading={priority ? "eager" : "lazy"}
          onError={() => {
            // Graceful fallback to default image if error occurs
            if (currentDisplaySrc !== baseSrc) {
              setCanvasRecoloredSrc(null);
            }
          }}
        />
      </AnimatePresence>

      {/* Dynamic Metallic Light Sweep / Paint Shimmer Effect */}
      {showShimmer && (
        <motion.div
          key={activeColor?.name || 'default'}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, 0.45, 0] }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-10"
        />
      )}

      {/* Processing Loader Indicator */}
      {isProcessing && (
        <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full bg-black/75 backdrop-blur-md border border-gold-400/30 flex items-center gap-1.5 text-[9px] text-gold-400 font-mono">
          <Loader2 className="w-3 h-3 animate-spin text-gold-400" />
          <span>Applying Paint...</span>
        </div>
      )}
    </div>
  );
}
