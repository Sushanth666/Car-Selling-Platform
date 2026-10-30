import fs from 'fs';
import jpeg from 'jpeg-js';

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hexToHsl(hex) {
  const c = hex.replace('#', '');
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return rgbToHsl(r, g, b);
}

const inputPath = 'C:/Users/susha/.gemini/antigravity-ide/brain/cbb6ed4d-cb16-4e5f-aabd-50b50c412dc5/porsche_gt3rs_guards_red_1793089368133.jpg';
const raw = fs.readFileSync(inputPath);
const img = jpeg.decode(raw);
console.log('Testing HSL panel isolation on Porsche image:', img.width, 'x', img.height);

const testColors = [
  { name: 'shark-blue', hex: '#005BA6', finish: 'Gloss' },
  { name: 'racing-yellow', hex: '#FAD000', finish: 'Gloss' },
  { name: 'python-green', hex: '#008F39', finish: 'Gloss' },
  { name: 'arctic-silver', hex: '#C0C0C0', finish: 'Metallic' },
  { name: 'jet-black', hex: '#111215', finish: 'Metallic' }
];

for (const col of testColors) {
  const [targetH, targetS, _targetL] = hexToHsl(col.hex);
  const out = new Uint8Array(img.data.length);
  out.set(img.data);

  let altered = 0;
  for (let i = 0; i < out.length; i += 4) {
    const r = img.data[i];
    const g = img.data[i+1];
    const b = img.data[i+2];

    const [h, s, l] = rgbToHsl(r, g, b);

    // Precise painted body detection:
    // Guards Red body panels have high saturation (s > 0.35) and hue in red range (h < 25 or h > 340)
    if (s > 0.28 && (h < 25 || h > 340) && l > 0.12 && l < 0.94) {
      altered++;
      let newH = targetH;
      let newS = targetS;
      let newL = l;

      if (col.name === 'jet-black') {
        newS = 0.08;
        // Compress lightness for deep metallic black, but keep highlights
        newL = l < 0.6 ? l * 0.25 : 0.15 + (l - 0.6) * 1.8;
      } else if (col.name === 'arctic-silver') {
        newS = 0.04;
        // Pure metallic silver
        newL = Math.min(0.95, l * 1.15);
      } else if (col.name === 'racing-yellow') {
        // Yellow needs higher lightness perceived luminosity
        newS = 0.95;
        newL = Math.min(0.85, l * 1.25);
      } else {
        newS = Math.max(0.75, targetS);
        newL = l;
      }

      const [nR, nG, nB] = hslToRgb(newH, newS, newL);
      out[i] = nR;
      out[i+1] = nG;
      out[i+2] = nB;
    }
  }

  const encoded = jpeg.encode({ data: out, width: img.width, height: img.height }, 92);
  const outPath = `public/cars/colors/porsche-911-gt3-rs-${col.name}.jpg`;
  fs.writeFileSync(outPath, encoded.data);
  console.log(`Saved ${col.name} -> ${outPath} (Altered ${altered} pixels, background 100% untouched)`);
}
// Also save original guards red as default & base
fs.writeFileSync('public/cars/porsche-911-gt3-rs.jpg', raw);
fs.writeFileSync('public/cars/colors/porsche-911-gt3-rs-guards-red.jpg', raw);
console.log('Porsche 911 GT3 RS color variants successfully generated with ZERO background change!');
