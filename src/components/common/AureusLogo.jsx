import React from 'react';

/**
 * AUREUS VELOCE — The Sovereign Kinetic
 * Bespoke Sovereign Golden Eagle Automotive Crest
 * Precision geometric aerodynamic wings, faceted royal shield & kinetic apex crest.
 */
export default function AureusLogo({
  layout = 'horizontal', // 'horizontal' | 'vertical' | 'icon'
  size = 'md',           // 'sm' | 'md' | 'lg' | 'xl'
  align = 'center',      // 'center' | 'left'
  className = '',
  showTagline = true,
  animated = false
}) {
  // Dimensions map for emblem icon
  const iconDimensions = {
    sm: { width: 36, height: 36 },
    md: { width: 48, height: 48 },
    lg: { width: 72, height: 72 },
    xl: { width: 96, height: 96 }
  }[size] || { width: 48, height: 48 };

  const uniqueId = React.useId().replace(/:/g, '');

  const EmblemSVG = (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${animated ? 'group-hover:scale-105 transition-transform duration-500' : ''}`}>
      {/* Ambient Gold Aura Glow */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-500/25 via-amber-400/20 to-transparent blur-md pointer-events-none transform scale-125"
      />

      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.45)]"
      >
        <defs>
          {/* 24K Sovereign Gold Linear Gradient */}
          <linearGradient id={`aureusGold-${uniqueId}`} x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="25%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#E5B83A" />
            <stop offset="75%" stopColor="#B38728" />
            <stop offset="100%" stopColor="#664C10" />
          </linearGradient>

          {/* Platinum Specular Shimmer */}
          <linearGradient id={`aureusShimmer-${uniqueId}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FFF2A1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C49622" stopOpacity="0.2" />
          </linearGradient>

          {/* Deep Obsidian Core Shield Gradient */}
          <linearGradient id={`aureusCore-${uniqueId}`} x1="60" y1="20" x2="60" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1C1D24" />
            <stop offset="60%" stopColor="#0B0C0E" />
            <stop offset="100%" stopColor="#020304" />
          </linearGradient>

          {/* Radial Jewel Glow */}
          <radialGradient id={`aureusCenterGlow-${uniqueId}`} cx="60" cy="55" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFECA8" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#E5B83A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E5B83A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Circular Precision Bezel with Tick Marks */}
        <circle cx="60" cy="60" r="56" stroke={`url(#aureusGold-${uniqueId})`} strokeWidth="1.2" strokeOpacity="0.6" strokeDasharray="3 3" />
        <circle cx="60" cy="60" r="52" stroke={`url(#aureusGold-${uniqueId})`} strokeWidth="1.6" strokeOpacity="0.85" />

        {/* Central Heraldic Shield Backdrop */}
        <path
          d="M60 18 L88 34 V66 C88 84 76 98 60 106 C44 98 32 84 32 66 V34 Z"
          fill={`url(#aureusCore-${uniqueId})`}
          stroke={`url(#aureusGold-${uniqueId})`}
          strokeWidth="2.2"
        />

        {/* Subtle shield inner contour */}
        <path
          d="M60 23 L83 37 V64 C83 79 73 91 60 99 C47 91 37 79 37 64 V37 Z"
          fill="none"
          stroke={`url(#aureusShimmer-${uniqueId})`}
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* === SOVEREIGN EAGLE WINGS (KINETIC FEATHER FOILS) === */}
        {/* Left Wing Outer Vane */}
        <path
          d="M60 48 C48 34 26 22 4 30 C18 42 32 54 44 64 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.95"
        />
        {/* Left Wing Mid Vane */}
        <path
          d="M58 56 C44 46 22 40 8 48 C20 57 34 66 46 72 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.85"
        />
        {/* Left Wing Lower Vane */}
        <path
          d="M56 65 C44 58 26 56 16 64 C26 71 38 76 48 78 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.75"
        />

        {/* Right Wing Outer Vane */}
        <path
          d="M60 48 C72 34 94 22 116 30 C102 42 88 54 76 64 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.95"
        />
        {/* Right Wing Mid Vane */}
        <path
          d="M62 56 C76 46 98 40 112 48 C100 57 86 66 74 72 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.85"
        />
        {/* Right Wing Lower Vane */}
        <path
          d="M64 65 C76 58 94 56 104 64 C94 71 82 76 72 78 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.75"
        />

        {/* === SOVEREIGN EAGLE HEAD & CREST (CENTER) === */}
        {/* Sovereign Eagle Crown / Apex Diamond */}
        <polygon
          points="60,26 66,35 60,39 54,35"
          fill={`url(#aureusShimmer-${uniqueId})`}
        />
        <polygon
          points="60,18 64,25 60,28 56,25"
          fill={`url(#aureusGold-${uniqueId})`}
        />

        {/* Eagle Head & Beak Silhouette */}
        <path
          d="M60 32 C63 32 67 35 68 39 C72 40 76 43 78 47 C74 48 70 47 67 49 C64 53 60 58 60 62 C60 58 56 53 53 49 C50 47 46 48 42 47 C44 43 48 40 52 39 C53 35 57 32 60 32 Z"
          fill={`url(#aureusShimmer-${uniqueId})`}
        />

        {/* Kinetic Chevron Ribs (V-velocity arrows) */}
        <path
          d="M60 66 L72 78 L68 81 L60 73 L52 81 L48 78 Z"
          fill={`url(#aureusGold-${uniqueId})`}
        />
        <path
          d="M60 76 L68 85 L65 87 L60 82 L55 87 L52 85 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.9"
        />
        <path
          d="M60 85 L65 91 L63 93 L60 89 L57 93 L55 91 Z"
          fill={`url(#aureusGold-${uniqueId})`}
          opacity="0.75"
        />

        {/* Center Jewel Glow */}
        <circle cx="60" cy="50" r="14" fill={`url(#aureusCenterGlow-${uniqueId})`} pointerEvents="none" />
        
        {/* Piercing Eye Accents */}
        <circle cx="57" cy="43" r="1.2" fill="#FFFFFF" />
        <circle cx="63" cy="43" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );

  // Icon only mode
  if (layout === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {EmblemSVG}
      </div>
    );
  }

  // Vertical layout: Logo strictly ABOVE the title (as requested by user)
  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col ${align === 'left' ? 'items-start text-left' : 'items-center text-center'} group cursor-pointer ${className}`}>
        {/* 1. CREATIVE LOGO EMBLEM ABOVE TITLE */}
        <div className="mb-2 sm:mb-3">
          {EmblemSVG}
        </div>

        {/* 2. BRAND TITLE: AUREUS VELOCE */}
        <div className={`flex flex-col ${align === 'left' ? 'items-start' : 'items-center'}`}>
          <h2 className="font-display font-extrabold tracking-[0.22em] text-white text-base sm:text-lg md:text-xl uppercase flex items-center gap-1.5 leading-tight text-3d-gold">
            <span>AUREUS</span>
            <span className="text-gold-400 font-light">VELOCE</span>
          </h2>

          {/* 3. TAGLINE: The Sovereign Kinetic */}
          {showTagline && (
            <p className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-amber-200/80 font-medium mt-1 font-sans">
              The Sovereign Kinetic
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default horizontal layout (ideal for sticky Header / Navbar)
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      {EmblemSVG}
      <div className="flex flex-col text-left">
        <span className="font-display font-extrabold text-sm sm:text-base md:text-lg tracking-[0.2em] text-white flex items-center gap-1.5 leading-none whitespace-nowrap">
          <span>AUREUS</span>
          <span className="text-gold-400 font-light">VELOCE</span>
        </span>
        {showTagline && (
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-amber-300/80 mt-1 font-medium leading-none whitespace-nowrap">
            The Sovereign Kinetic
          </span>
        )}
      </div>
    </div>
  );
}
