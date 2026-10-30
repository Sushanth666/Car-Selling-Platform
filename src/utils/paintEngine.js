/**
 * Real-time automotive paint engine for client-side body panel recoloring.
 * Preserves tyres, wheels, dark shadows, glass, headlights, carbon fiber,
 * body lines, and specular highlights without applying crude whole-image filters.
 */

// Cache processed canvas data URLs to avoid recomputing identical car/color pairs
const canvasCache = new Map();

/**
 * Converts a hex color string to RGB object
 */
export function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Recolor car body panels onto an HTML5 Canvas while preserving
 * tyres, wheels, glass, lights, carbon fiber, reflections, and background.
 */
export function recolorCarImage(imageElement, targetHex, finish = "Metallic", quality = 1.0) {
  if (!imageElement || !imageElement.naturalWidth || !imageElement.naturalHeight) {
    return null;
  }

  const cacheKey = `${imageElement.src}_${targetHex}_${finish}`;
  if (canvasCache.has(cacheKey)) {
    return canvasCache.get(cacheKey);
  }

  const width = Math.round(imageElement.naturalWidth * quality);
  const height = Math.round(imageElement.naturalHeight * quality);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  // Draw base photograph
  ctx.drawImage(imageElement, 0, 0, width, height);

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const target = hexToRgb(targetHex);

    // Target color characteristics
    const targetLuminance = (0.299 * target.r + 0.587 * target.g + 0.114 * target.b) / 255;
    const isDarkTarget = targetLuminance < 0.25;
    const isWhiteTarget = targetLuminance > 0.85;

    // Metallic flake coefficient
    const isMetallic = finish === "Metallic" || finish === "Perlescent";
    const isMatte = finish === "Matte" || finish === "Matte Magno";

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 10) continue;

      const pixelIdx = i / 4;
      const x = pixelIdx % width;
      const y = Math.floor(pixelIdx / width);
      const xR = x / width;
      const yR = y / height;

      // Strict spatial boundary exclusion: Never touch ceiling, upper wall logos, or floor below wheels
      if (yR < 0.22 || yR > 0.86) continue;
      if (xR < 0.04 || xR > 0.96) continue;

      // 1. Calculate luminance (perceived brightness)
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // 2. Calculate chroma / saturation
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const delta = maxC - minC;

      // 3. Protection filters:
      // A. Deep blacks (tyres, wheels, asphalt under-shadow, dark carbon grilles)
      if (lum < 38) continue;
      if (lum < 70 && delta < 16) continue;

      // B. Specular highlights & chrome (sun reflections on glass/mirrors)
      if (lum > 248 && delta < 20) continue;

      // C. Transparent glass / windshield & neutral studio background (walls, floor, shadows)
      // Car body metal has saturation when colored; neutral walls/floor have low chroma
      if (delta < 20) continue;

      // Soft edge feathering based on saturation
      const paintWeight = Math.min(1.0, Math.max(0.4, (delta - 18) / 25));

      // 5. Apply Automotive Photorealistic Paint Shading
      // Normalizing luminance multiplier so car creases, shadows & highlights are preserved
      const normLum = lum / 255;
      
      let newR, newG, newB;

      if (isDarkTarget) {
        // Deep gloss black / charcoal
        newR = target.r * 0.4 + r * 0.25 + lum * 0.15;
        newG = target.g * 0.4 + g * 0.25 + lum * 0.15;
        newB = target.b * 0.4 + b * 0.25 + lum * 0.15;
      } else if (isWhiteTarget) {
        // Pearlescent or Carrara White
        const whiteLum = Math.min(255, lum * 1.35 + 30);
        newR = whiteLum * 0.9 + target.r * 0.1;
        newG = whiteLum * 0.9 + target.g * 0.1;
        newB = whiteLum * 0.92 + target.b * 0.08;
      } else {
        // Vibrant or rich metallic pigment
        // Multiply luminance by target pigment while retaining specular gloss
        const blendR = (target.r / 255) * (lum * 1.05);
        const blendG = (target.g / 255) * (lum * 1.05);
        const blendB = (target.b / 255) * (lum * 1.05);

        // Add metallic highlight sheen if high luminance
        const highlightBoost = isMetallic && normLum > 0.6 ? (normLum - 0.6) * 70 : 0;
        const matteDull = isMatte ? 0.9 : 1.0;

        newR = (blendR * matteDull) + highlightBoost;
        newG = (blendG * matteDull) + highlightBoost;
        newB = (blendB * matteDull) + highlightBoost;
      }

      // Blend new paint with original pixel based on calculated mask weight
      data[i] = Math.round(r * (1 - paintWeight) + newR * paintWeight);
      data[i + 1] = Math.round(g * (1 - paintWeight) + newG * paintWeight);
      data[i + 2] = Math.round(b * (1 - paintWeight) + newB * paintWeight);
    }

    ctx.putImageData(imgData, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    canvasCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch (err) {
    console.warn("Canvas paint processing error:", err);
    return null;
  }
}
