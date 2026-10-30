import fs from 'fs';
import jpeg from 'jpeg-js';

const colorsDir = 'public/cars/colors';
if (!fs.existsSync(colorsDir)) {
  fs.mkdirSync(colorsDir, { recursive: true });
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

export function generateColorVariant(inputJpg, outputJpg, targetHex, finish = 'Metallic') {
  const raw = fs.readFileSync(inputJpg);
  const img = jpeg.decode(raw, { useTArray: true });
  const { width, height, data } = img;
  const target = hexToRgb(targetHex);

  const targetLum = (0.299 * target.r + 0.587 * target.g + 0.114 * target.b) / 255;
  const isDarkTarget = targetLum < 0.28;
  const isWhiteTarget = targetLum > 0.82;
  const isMetallic = finish === 'Metallic' || finish === 'Perlescent';

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const delta = maxC - minC;

    // 1. Deep blacks, tyres, wheels, road under-shadows
    if (lum < 38) continue;
    if (lum < 75 && delta < 18) continue;

    // 2. Specular chrome highlights, bright sun reflection on glass
    if (lum > 245 && delta < 20) continue;

    // 3. Cabin interior / glass protection
    if (delta < 14 && lum < 90) continue;

    // 4. Calculate Paint Mask Weight (smooth roll-off)
    let weight = 1.0;
    if (lum < 55) {
      weight = (lum - 38) / (55 - 38);
    } else if (lum > 225) {
      weight = Math.max(0, (245 - lum) / (245 - 225));
    }

    if (delta < 15 && lum > 180) {
      weight *= 0.5;
    }

    if (weight <= 0.05) continue;

    const normLum = lum / 255;
    let newR, newG, newB;

    if (isDarkTarget) {
      newR = target.r * 0.45 + r * 0.25 + lum * 0.12;
      newG = target.g * 0.45 + g * 0.25 + lum * 0.12;
      newB = target.b * 0.45 + b * 0.25 + lum * 0.12;
    } else if (isWhiteTarget) {
      const whiteLum = Math.min(255, lum * 1.35 + 30);
      newR = whiteLum * 0.9 + target.r * 0.1;
      newG = whiteLum * 0.9 + target.g * 0.1;
      newB = whiteLum * 0.92 + target.b * 0.08;
    } else {
      const blendR = (target.r / 255) * (lum * 1.08);
      const blendG = (target.g / 255) * (lum * 1.08);
      const blendB = (target.b / 255) * (lum * 1.08);

      const sheen = isMetallic && normLum > 0.55 ? (normLum - 0.55) * 65 : 0;
      newR = blendR + sheen;
      newG = blendG + sheen;
      newB = blendB + sheen;
    }

    data[i] = Math.min(255, Math.max(0, Math.round(r * (1 - weight) + newR * weight)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round(g * (1 - weight) + newG * weight)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round(b * (1 - weight) + newB * weight)));
  }

  const encoded = jpeg.encode({ data, width, height }, 90);
  fs.writeFileSync(outputJpg, encoded.data);
  console.log('Generated', outputJpg, `${Math.round(encoded.data.length / 1024)} KB`);
}

// Cars and their requested specific factory color variants
const carVariants = [
  {
    carId: 'porsche-911-gt3-rs',
    source: 'public/cars/porsche-911-gt3-rs.jpg',
    colors: [
      { slug: 'silver', hex: '#C0C0C0', finish: 'Metallic' },
      { slug: 'red', hex: '#D91424', finish: 'Gloss' },
      { slug: 'blue', hex: '#00629B', finish: 'Gloss' },
      { slug: 'yellow', hex: '#F9D71C', finish: 'Gloss' },
      { slug: 'green', hex: '#2BB673', finish: 'Gloss' },
      { slug: 'black', hex: '#111111', finish: 'Metallic' }
    ]
  },
  {
    carId: 'ferrari-sf90-stradale',
    source: 'public/cars/ferrari-sf90-stradale.jpg',
    colors: [
      { slug: 'red', hex: '#D40000', finish: 'Gloss' },
      { slug: 'yellow', hex: '#FFD700', finish: 'Gloss' },
      { slug: 'black', hex: '#121212', finish: 'Metallic' },
      { slug: 'blue', hex: '#1560BD', finish: 'Metallic' },
      { slug: 'silver', hex: '#C4C4C4', finish: 'Metallic' }
    ]
  },
  {
    carId: 'lamborghini-revuelto',
    source: 'public/cars/lamborghini-revuelto.jpg',
    colors: [
      { slug: 'orange', hex: '#FF5E00', finish: 'Metallic' },
      { slug: 'green', hex: '#44D62C', finish: 'Perlescent' },
      { slug: 'yellow', hex: '#FFE600', finish: 'Metallic' },
      { slug: 'white', hex: '#F4F4F4', finish: 'Perlescent' },
      { slug: 'grey', hex: '#5A6268', finish: 'Matte' },
      { slug: 'black', hex: '#1A1A1A', finish: 'Metallic' }
    ]
  },
  {
    carId: 'mclaren-750s-spider',
    source: 'public/cars/mclaren-750s-spider.jpg',
    colors: [
      { slug: 'orange', hex: '#FF8000', finish: 'Metallic' },
      { slug: 'white', hex: '#F5F5F7', finish: 'Gloss' },
      { slug: 'black', hex: '#161618', finish: 'Metallic' },
      { slug: 'blue', hex: '#1B4D89', finish: 'Metallic' },
      { slug: 'red', hex: '#B31B1B', finish: 'Perlescent' }
    ]
  },
  {
    carId: 'bugatti-chiron-pur-sport',
    source: 'public/cars/bugatti-chiron-pur-sport.jpg',
    colors: [
      { slug: 'blue', hex: '#0047AB', finish: 'Gloss' },
      { slug: 'darkblue', hex: '#0A192F', finish: 'Metallic' },
      { slug: 'black', hex: '#111111', finish: 'Gloss' },
      { slug: 'red', hex: '#C41E3A', finish: 'Gloss' }
    ]
  },
  {
    carId: 'koenigsegg-jesko',
    source: 'public/cars/koenigsegg-jesko.jpg',
    colors: [
      { slug: 'white', hex: '#FAFAFA', finish: 'Perlescent' },
      { slug: 'orange', hex: '#FF6F00', finish: 'Metallic' },
      { slug: 'blue', hex: '#0D47A1', finish: 'Metallic' },
      { slug: 'black', hex: '#151515', finish: 'Gloss' }
    ]
  },
  {
    carId: 'bmw-m4-competition',
    source: 'public/cars/bmw-m4-competition.jpg',
    colors: [
      { slug: 'green', hex: '#005A36', finish: 'Metallic' },
      { slug: 'yellow', hex: '#E7D11A', finish: 'Gloss' },
      { slug: 'red', hex: '#B81414', finish: 'Metallic' },
      { slug: 'blue', hex: '#1F4788', finish: 'Metallic' },
      { slug: 'grey', hex: '#7A8084', finish: 'Gloss' },
      { slug: 'black', hex: '#0D0E10', finish: 'Metallic' }
    ]
  },
  {
    carId: 'mercedes-amg-gt-black-series',
    source: 'public/cars/mercedes-amg-gt-black-series.jpg',
    colors: [
      { slug: 'orange', hex: '#FF5400', finish: 'Metallic' },
      { slug: 'green', hex: '#228B22', finish: 'Matte' },
      { slug: 'white', hex: '#F0F0F0', finish: 'Perlescent' },
      { slug: 'blue', hex: '#0F52BA', finish: 'Metallic' },
      { slug: 'black', hex: '#141416', finish: 'Metallic' }
    ]
  },
  {
    carId: 'lamborghini-urus-performante',
    source: 'public/cars/lamborghini-urus-performante.jpg',
    colors: [
      { slug: 'yellow', hex: '#FFD700', finish: 'Metallic' },
      { slug: 'green', hex: '#39FF14', finish: 'Perlescent' },
      { slug: 'orange', hex: '#FF4500', finish: 'Gloss' },
      { slug: 'black', hex: '#111113', finish: 'Metallic' }
    ]
  },
  {
    carId: 'rolls-royce-cullinan',
    source: 'public/cars/rolls-royce-spectre.jpg',
    colors: [
      { slug: 'black', hex: '#0B0B0C', finish: 'Metallic' },
      { slug: 'white', hex: '#FFFFFF', finish: 'Gloss' },
      { slug: 'blue', hex: '#10223D', finish: 'Metallic' },
      { slug: 'red', hex: '#58111A', finish: 'Metallic' }
    ]
  },
  {
    carId: 'aston-martin-dbx707',
    source: 'public/cars/aston-martin-dbs-770-ultimate.jpg',
    colors: [
      { slug: 'grey', hex: '#4B5358', finish: 'Metallic' },
      { slug: 'green', hex: '#004225', finish: 'Gloss' },
      { slug: 'black', hex: '#111215', finish: 'Metallic' }
    ]
  },
  {
    carId: 'ferrari-296-gtb',
    source: 'public/cars/ferrari-purosangue.jpg',
    colors: [
      { slug: 'red', hex: '#CC0000', finish: 'Gloss' },
      { slug: 'blue', hex: '#102A43', finish: 'Metallic' },
      { slug: 'grey', hex: '#484F56', finish: 'Metallic' }
    ]
  },
  {
    carId: 'bentley-continental-gt-speed',
    source: 'public/cars/bentley-continental-gt-mulliner.jpg',
    colors: [
      { slug: 'green', hex: '#1C352D', finish: 'Metallic' },
      { slug: 'blue', hex: '#0F4C81', finish: 'Metallic' },
      { slug: 'black', hex: '#0F1012', finish: 'Metallic' }
    ]
  },
  {
    carId: 'porsche-taycan-turbo-gt',
    source: 'public/cars/porsche-taycan-turbo-gt.jpg',
    colors: [
      { slug: 'blue', hex: '#7E9DAF', finish: 'Metallic' },
      { slug: 'purple', hex: '#4C2852', finish: 'Metallic' },
      { slug: 'grey', hex: '#3A3D40', finish: 'Metallic' },
      { slug: 'white', hex: '#FAFAFA', finish: 'Gloss' }
    ]
  }
];

console.log('Starting car color variant generation...');
for (const item of carVariants) {
  if (!fs.existsSync(item.source)) {
    console.warn('Source image missing:', item.source);
    continue;
  }
  for (const c of item.colors) {
    const outFile = `public/cars/colors/${item.carId}-${c.slug}.jpg`;
    generateColorVariant(item.source, outFile, c.hex, c.finish);
  }
}
console.log('All car color variants generated successfully!');
