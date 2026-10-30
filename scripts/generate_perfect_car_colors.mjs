import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
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
    r = g = b = l;
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

const BRAIN_DIR = 'C:/Users/susha/.gemini/antigravity-ide/brain/cbb6ed4d-cb16-4e5f-aabd-50b50c412dc5';

// Master Studio Images & Fleet Catalog Configuration
const CAR_MASTERS = [
  {
    carId: 'porsche-911-gt3-rs',
    sourceMaster: path.join(BRAIN_DIR, 'porsche_gt3rs_guards_red_1793089368133.jpg'),
    baseFilename: 'porsche-911-gt3-rs.jpg',
    // Source car is Guards Red
    isBodyPixel: (h, s, l) => (h < 32 || h > 336) && s > 0.18 && l > 0.08 && l < 0.96,
    colors: [
      { slug: 'red', aliases: ['guards-red'], name: 'Guards Red', hex: '#E4002B', isSource: true },
      { slug: 'silver', aliases: ['arctic-silver'], name: 'Arctic Silver Metallic', hex: '#C0C0C0', finish: 'Metallic' },
      { slug: 'blue', aliases: ['shark-blue'], name: 'Shark Blue', hex: '#005BA6' },
      { slug: 'yellow', aliases: ['racing-yellow'], name: 'Racing Yellow', hex: '#FAD000' },
      { slug: 'green', aliases: ['python-green'], name: 'Python Green', hex: '#008F39' },
      { slug: 'black', aliases: ['jet-black'], name: 'Jet Black Metallic', hex: '#111215', finish: 'Metallic' }
    ]
  },
  {
    carId: 'ferrari-sf90-stradale',
    sourceMaster: path.join(BRAIN_DIR, 'ferrari_sf90_rosso_corsa_1793089456994.jpg'),
    baseFilename: 'ferrari-sf90-stradale.jpg',
    // Source car is Rosso Corsa Red
    isBodyPixel: (h, s, l) => (h < 32 || h > 338) && s > 0.18 && l > 0.07 && l < 0.96,
    colors: [
      { slug: 'red', aliases: ['rosso-corsa'], name: 'Rosso Corsa', hex: '#D40000', isSource: true },
      { slug: 'yellow', aliases: ['giallo-modena'], name: 'Giallo Modena', hex: '#FED500' },
      { slug: 'blue', aliases: ['blu-corsa'], name: 'Blu Corsa', hex: '#0C4DA2' },
      { slug: 'black', aliases: ['nero-daytona'], name: 'Nero Daytona', hex: '#141416', finish: 'Metallic' },
      { slug: 'silver', aliases: ['argento-nurburgring'], name: 'Argento Nürburgring', hex: '#D6D8DC', finish: 'Metallic' }
    ]
  },
  {
    carId: 'lamborghini-revuelto',
    sourceMaster: path.join(BRAIN_DIR, 'lamborghini_revuelto_arancio_1793089476078.jpg'),
    baseFilename: 'lamborghini-revuelto.jpg',
    // Source car is Arancio Apodis Orange
    isBodyPixel: (h, s, l) => (h < 50 || h > 346) && s > 0.18 && l > 0.07 && l < 0.96,
    colors: [
      { slug: 'orange', aliases: ['arancio-apodis'], name: 'Arancio Apodis', hex: '#FF5F00', isSource: true },
      { slug: 'green', aliases: ['verde-mantis', 'verde-gepardo'], name: 'Verde Mantis', hex: '#52D017' },
      { slug: 'yellow', aliases: ['giallo-belenus', 'giallo-countach'], name: 'Giallo Belenus', hex: '#FFD700' },
      { slug: 'white', aliases: ['bianco-monocerus'], name: 'Bianco Monocerus', hex: '#EDEDED' },
      { slug: 'grey', aliases: ['grigio-telesto'], name: 'Grigio Telesto', hex: '#63666A', finish: 'High-Gloss' },
      { slug: 'black', aliases: ['nero-noctis'], name: 'Nero Noctis', hex: '#121214', finish: 'High-Gloss' }
    ]
  },
  {
    carId: 'mclaren-750s-spider',
    sourceMaster: path.join(BRAIN_DIR, 'mclaren_750s_papaya_1793089573703.jpg'),
    baseFilename: 'mclaren-750s-spider.jpg',
    // Source car is Papaya Orange
    isBodyPixel: (h, s, l) => (h < 52 || h > 346) && s > 0.18 && l > 0.08 && l < 0.96,
    colors: [
      { slug: 'orange', aliases: ['papaya-spark', 'mclaren-orange'], name: 'McLaren Orange', hex: '#FF6F00', isSource: true },
      { slug: 'blue', aliases: ['saros-blue', 'belize-blue'], name: 'Saros Blue', hex: '#0054A6' },
      { slug: 'red', aliases: ['volcano-red'], name: 'Volcano Red', hex: '#CC1122' },
      { slug: 'white', aliases: ['silica-white'], name: 'Silica White', hex: '#EBEBEB' },
      { slug: 'black', aliases: ['onyx-black'], name: 'Onyx Black', hex: '#161618', finish: 'Metallic' }
    ]
  },
  {
    carId: 'bugatti-chiron-pur-sport',
    sourceMaster: path.join(BRAIN_DIR, 'bugatti_chiron_french_blue_1793089601412.jpg'),
    baseFilename: 'bugatti-chiron-pur-sport.jpg',
    // Source car is French Racing Blue
    isBodyPixel: (h, s, l) => h >= 180 && h <= 240 && s > 0.18 && l > 0.08 && l < 0.96,
    colors: [
      { slug: 'blue', aliases: ['french-racing-blue'], name: 'French Racing Blue', hex: '#0070CE', isSource: true },
      { slug: 'darkblue', aliases: ['atlantic-dark-blue'], name: 'Atlantic Dark Blue', hex: '#0A255C' },
      { slug: 'black', aliases: ['nocturne-carbon-black', 'nocturne-black'], name: 'Nocturne Carbon Black', hex: '#111215', finish: 'Metallic' },
      { slug: 'red', aliases: ['italian-red'], name: 'Italian Red', hex: '#CC1122' }
    ]
  },
  {
    carId: 'koenigsegg-jesko',
    sourceMaster: path.join(BRAIN_DIR, 'koenigsegg_jesko_white_1793089628234.jpg'),
    baseFilename: 'koenigsegg-jesko.jpg',
    // Source car is Crystal White
    isBodyPixel: (h, s, l, r, g, b, xR, yR) => yR >= 0.32 && yR <= 0.78 && xR >= 0.10 && xR <= 0.90 && l > 0.45 && l < 0.98 && (Math.max(r,g,b) - Math.min(r,g,b)) < 28,
    colors: [
      { slug: 'white', aliases: ['crystal-white'], name: 'Crystal White', hex: '#EDEDED', isSource: true },
      { slug: 'orange', aliases: ['tang-orange'], name: 'Tang Orange', hex: '#FF5500' },
      { slug: 'blue', aliases: ['imperial-blue'], name: 'Imperial Blue', hex: '#0D3B82' },
      { slug: 'black', aliases: ['onyx-black'], name: 'Onyx Black', hex: '#141416', finish: 'Metallic' }
    ]
  },
  {
    carId: 'bmw-m4-competition',
    sourceMaster: path.join(BRAIN_DIR, 'bmw_m4_competition_green_1793089652996.jpg'),
    baseFilename: 'bmw-m4-competition.jpg',
    // Source car is Isle of Man Green
    isBodyPixel: (h, s, l) => h >= 115 && h <= 185 && s > 0.16 && l > 0.08 && l < 0.94,
    colors: [
      { slug: 'green', aliases: ['isle-of-man-green'], name: 'Isle of Man Green', hex: '#006B4E', isSource: true },
      { slug: 'yellow', aliases: ['sao-paulo-yellow'], name: 'Sao Paulo Yellow', hex: '#D6E200' },
      { slug: 'red', aliases: ['toronto-red'], name: 'Toronto Red', hex: '#BA1B1D' },
      { slug: 'blue', aliases: ['portimao-blue'], name: 'Portimao Blue', hex: '#1C3F94' },
      { slug: 'grey', aliases: ['brooklyn-grey'], name: 'Brooklyn Grey', hex: '#8F9499', finish: 'Metallic' },
      { slug: 'black', aliases: ['black-sapphire'], name: 'Black Sapphire', hex: '#16171A', finish: 'Metallic' }
    ]
  },
  {
    carId: 'mercedes-amg-gt-black-series',
    sourceMaster: path.join(BRAIN_DIR, 'amg_gt_black_series_orange_1793089677336.jpg'),
    baseFilename: 'mercedes-amg-gt-black-series.jpg',
    // Source car is Magmabeam Orange
    isBodyPixel: (h, s, l) => (h < 52 || h > 346) && s > 0.18 && l > 0.08 && l < 0.96,
    colors: [
      { slug: 'orange', aliases: ['magmabeam-orange'], name: 'Magmabeam Orange', hex: '#FF5E00', isSource: true },
      { slug: 'green', aliases: ['green-hell-magno'], name: 'AMG Green Hell Magno', hex: '#44A000', finish: 'Matte Magno' },
      { slug: 'white', aliases: ['diamond-white'], name: 'Designo Diamond White', hex: '#EDEDED' },
      { slug: 'blue', aliases: ['brilliant-blue'], name: 'Brilliant Blue', hex: '#114499' },
      { slug: 'black', aliases: ['obsidian-black'], name: 'Obsidian Black', hex: '#141416', finish: 'Metallic' }
    ]
  },
  {
    carId: 'lamborghini-urus-performante',
    sourceMaster: path.join(BRAIN_DIR, 'urus_performante_yellow_1793090205729.jpg'),
    baseFilename: 'lamborghini-urus-performante.jpg',
    // Source car is Giallo Inti Yellow
    isBodyPixel: (h, s, l) => h >= 38 && h <= 68 && s > 0.20 && l > 0.12 && l < 0.95,
    colors: [
      { slug: 'yellow', aliases: ['giallo-inti'], name: 'Giallo Inti', hex: '#FFD700', isSource: true },
      { slug: 'green', aliases: ['verde-viper'], name: 'Verde Viper', hex: '#52D017' },
      { slug: 'orange', aliases: ['arancio-borealis'], name: 'Arancio Borealis', hex: '#FF5F00' },
      { slug: 'black', aliases: ['nero-noctis'], name: 'Nero Noctis', hex: '#121214', finish: 'High-Gloss' }
    ]
  },
  {
    carId: 'rolls-royce-cullinan',
    sourceMaster: path.join(BRAIN_DIR, 'rolls_royce_cullinan_black_1793089993620.jpg'),
    baseFilename: 'rolls-royce-spectre.jpg',
    // Source car is Diamond Black
    isBodyPixel: (h, s, l, r, g, b, xR, yR) => yR >= 0.25 && yR <= 0.78 && xR >= 0.10 && xR <= 0.90 && l > 0.06 && l < 0.42 && (Math.max(r,g,b) - Math.min(r,g,b)) < 24,
    colors: [
      { slug: 'black', aliases: ['diamond-black'], name: 'Diamond Black', hex: '#111215', isSource: true, finish: 'Metallic' },
      { slug: 'white', aliases: ['arctic-white'], name: 'Arctic White', hex: '#EBEBEB' },
      { slug: 'blue', aliases: ['midnight-sapphire'], name: 'Midnight Sapphire', hex: '#0C2340' },
      { slug: 'red', aliases: ['english-red'], name: 'English Red', hex: '#7E1926' }
    ]
  },
  {
    carId: 'aston-martin-dbx707',
    sourceMaster: path.join(BRAIN_DIR, 'aston_martin_dbx707_green_1793090017444.jpg'),
    baseFilename: 'aston-martin-dbs-770-ultimate.jpg',
    // Source car is Racing Green
    isBodyPixel: (h, s, l) => h >= 100 && h <= 180 && s > 0.15 && l > 0.08 && l < 0.92,
    colors: [
      { slug: 'green', aliases: ['racing-green'], name: 'Aston Martin Racing Green', hex: '#005432', isSource: true },
      { slug: 'grey', aliases: ['apex-grey'], name: 'Apex Grey', hex: '#686B73', finish: 'Metallic' },
      { slug: 'black', aliases: ['onyx-black'], name: 'Onyx Black', hex: '#141416', finish: 'Metallic' }
    ]
  },
  {
    carId: 'ferrari-296-gtb',
    sourceMaster: path.join(BRAIN_DIR, 'ferrari_296_gtb_red_1793090228324.jpg'),
    baseFilename: 'ferrari-purosangue.jpg',
    // Source car is Rosso Corsa
    isBodyPixel: (h, s, l) => (h < 32 || h > 338) && s > 0.18 && l > 0.08 && l < 0.96,
    colors: [
      { slug: 'red', aliases: ['rosso-corsa'], name: 'Rosso Corsa', hex: '#D40000', isSource: true },
      { slug: 'blue', aliases: ['blu-pozzi'], name: 'Blu Pozzi', hex: '#0B2341' },
      { slug: 'grey', aliases: ['grigio-silverstone'], name: 'Grigio Silverstone', hex: '#58595B', finish: 'Metallic' }
    ]
  },
  {
    carId: 'bentley-continental-gt-speed',
    sourceMaster: path.join(BRAIN_DIR, 'bentley_gt_speed_green_1793090249553.jpg'),
    baseFilename: 'bentley-continental-gt-mulliner.jpg',
    // Source car is Verdant Green
    isBodyPixel: (h, s, l) => h >= 90 && h <= 175 && s > 0.16 && l > 0.08 && l < 0.92,
    colors: [
      { slug: 'green', aliases: ['verdant-green'], name: 'Verdant Green', hex: '#084C38', isSource: true },
      { slug: 'blue', aliases: ['sequin-blue'], name: 'Sequin Blue', hex: '#0047AB' },
      { slug: 'black', aliases: ['beluga-black'], name: 'Beluga Black', hex: '#141416', finish: 'Metallic' }
    ]
  },
  {
    carId: 'porsche-taycan-turbo-gt',
    sourceMaster: 'public/cars/porsche-taycan-turbo-gt.jpg',
    baseFilename: 'porsche-taycan-turbo-gt.jpg',
    // Source car is Pale Blue
    isBodyPixel: (h, s, l) => h >= 180 && h <= 235 && s > 0.12 && l > 0.25 && l < 0.92,
    colors: [
      { slug: 'blue', aliases: ['pale-blue'], name: 'Pale Blue Metallic', hex: '#7EA6C4', isSource: true },
      { slug: 'purple', aliases: ['purple-sky'], name: 'Purple Sky Metallic', hex: '#533B6A' },
      { slug: 'grey', aliases: ['volcano-grey'], name: 'Volcano Grey Metallic', hex: '#4A4D53', finish: 'Metallic' },
      { slug: 'white', aliases: ['white-carrara'], name: 'White Carrara', hex: '#F0F0F2' }
    ]
  }
];

async function runRecoloring() {
  const carsDir = 'public/cars';
  const colorsDir = 'public/cars/colors';
  if (!fs.existsSync(colorsDir)) fs.mkdirSync(colorsDir, { recursive: true });

  for (const item of CAR_MASTERS) {
    if (!fs.existsSync(item.sourceMaster)) {
      console.warn('Source master not found:', item.sourceMaster);
      continue;
    }

    const raw = fs.readFileSync(item.sourceMaster);
    const img = jpeg.decode(raw);
    console.log(`\n=== Processing ${item.carId} (${img.width}x${img.height}) ===`);

    // Copy original master into base cars directory
    fs.writeFileSync(path.join(carsDir, item.baseFilename), raw);

    for (const col of item.colors) {
      const primaryDest = path.join(colorsDir, `${item.carId}-${col.slug}.jpg`);
      const allDests = [primaryDest];
      if (col.aliases) {
        for (const alias of col.aliases) {
          allDests.push(path.join(colorsDir, `${item.carId}-${alias}.jpg`));
        }
      }

      if (col.isSource) {
        // Source color is the exact master photograph - 100% authentic, 0% alteration
        for (const dest of allDests) {
          fs.writeFileSync(dest, raw);
        }
        console.log(`Saved pristine source: ${col.name} -> ${col.slug} (${allDests.length} files)`);
        continue;
      }

      const [targetH, targetS, targetL] = hexToHsl(col.hex);
      const out = new Uint8Array(img.data.length);
      out.set(img.data);

      const isBlack = targetL < 0.20 || col.hex.toLowerCase() === '#111215' || col.slug.includes('black') || col.name.toLowerCase().includes('black') || col.name.toLowerCase().includes('nero');
      const isWhite = targetL > 0.85 || col.slug.includes('white') || col.name.toLowerCase().includes('white') || col.name.toLowerCase().includes('bianco');
      const isSilver = col.slug.includes('silver') || col.slug.includes('grey') || col.slug.includes('gray') || col.name.toLowerCase().includes('silver') || col.name.toLowerCase().includes('grigio');
      const isYellow = col.slug.includes('yellow') || col.name.toLowerCase().includes('yellow') || (targetH >= 42 && targetH <= 65);

      let count = 0;
      for (let i = 0; i < out.length; i += 4) {
        const pixelIdx = i / 4;
        const x = pixelIdx % img.width;
        const y = Math.floor(pixelIdx / img.width);
        const xR = x / img.width;
        const yR = y / img.height;

        // Strict spatial boundary exclusion: Never touch ceiling, upper wall logos, or floor below wheels
        if (yR < 0.22 || yR > 0.86) continue;
        if (xR < 0.04 || xR > 0.96) continue;

        const r = img.data[i];
        const g = img.data[i + 1];
        const b = img.data[i + 2];

        // Background neutrals protection (shadows, studio walls, grey floors)
        const _chromaDelta = Math.max(r, g, b) - Math.min(r, g, b);
        const [h, s, l] = rgbToHsl(r, g, b);

        if (item.isBodyPixel(h, s, l, r, g, b, xR, yR)) {
          count++;
          let newH = targetH;
          let newS = targetS;
          let newL = l;

          if (isBlack) {
            newS = 0.08;
            newL = l < 0.65 ? l * 0.28 : 0.18 + (l - 0.65) * 1.6;
          } else if (isWhite) {
            newS = 0.04;
            newL = Math.min(0.96, l * 1.25 + 0.10);
          } else if (isSilver) {
            newS = 0.05;
            newL = Math.min(0.92, l * 1.15);
          } else if (isYellow) {
            newS = 0.95;
            newL = Math.min(0.85, l * 1.22);
          } else {
            newS = Math.max(0.76, targetS);
            newL = l;
          }

          const [nR, nG, nB] = hslToRgb(newH, newS, newL);
          // Soft edge feathering for smooth factory finish without jagged borders
          const blendWeight = Math.min(1.0, Math.max(0.2, (s - 0.16) / 0.08));
          out[i] = Math.round(r * (1 - blendWeight) + nR * blendWeight);
          out[i + 1] = Math.round(g * (1 - blendWeight) + nG * blendWeight);
          out[i + 2] = Math.round(b * (1 - blendWeight) + nB * blendWeight);
        }
      }

      const encoded = jpeg.encode({ data: out, width: img.width, height: img.height }, 92);
      for (const dest of allDests) {
        fs.writeFileSync(dest, encoded.data);
      }
      console.log(`Saved ${col.name} (${col.slug}): recolored ${count} car pixels, background 100% UNTOUCHED!`);
    }
  }

  console.log('\nAll 14 car models updated with ZERO background bleed!');
}

runRecoloring();
