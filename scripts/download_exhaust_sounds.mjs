import fs from 'fs';
import path from 'path';

const CAR_AUDIO_TARGETS = [
  {
    carId: 'porsche-911-gt3-rs',
    filename: 'porsche-911-gt3-rs.opus',
    searchTitle: 'File:Porsche 992 - engine and exhaust sound (YouTube PqvY5ONBjxw).opus',
    fallbackQuery: 'Porsche 992 engine sound file:opus'
  },
  {
    carId: 'ferrari-sf90-stradale',
    filename: 'ferrari-sf90-stradale.opus',
    searchTitle: 'File:Ferrari SF90 - engine and exhaust sound (YouTube hxXRbb6VFZw).opus',
    fallbackQuery: 'Ferrari SF90 engine sound file:opus'
  },
  {
    carId: 'lamborghini-revuelto',
    filename: 'lamborghini-revuelto.opus',
    searchTitle: 'File:Lamborghini Huracan Performante - engine and exhaust sound (YouTube QsDJ3Y7k4qg).opus',
    fallbackQuery: 'Lamborghini engine sound file:opus'
  },
  {
    carId: 'mclaren-750s-spider',
    filename: 'mclaren-750s.opus',
    searchTitle: 'File:McLaren 765LT - engine and exhaust sound (YouTube 5oSRv66QFW0).opus',
    fallbackQuery: 'McLaren engine sound file:opus'
  },
  {
    carId: 'rolls-royce-cullinan-black-badge',
    filename: 'rolls-royce-cullinan.opus',
    searchTitle: 'File:Bentley Bentayga - engine and exhaust sound (YouTube OjhC7D9RT9M).opus',
    fallbackQuery: 'V12 luxury engine sound file:opus'
  },
  {
    carId: 'aston-martin-dbx707',
    filename: 'aston-martin-dbx707.opus',
    searchTitle: 'File:Aston Martin DBX - engine and exhaust sound (YouTube UsR10oSVifI).opus',
    fallbackQuery: 'Aston Martin DBX engine sound file:opus'
  },
  {
    carId: 'lamborghini-urus-performante',
    filename: 'lamborghini-urus.opus',
    searchTitle: 'File:Lamborghini Urus - engine and exhaust sound (YouTube VohRqzrnZ2U).opus',
    fallbackQuery: 'Lamborghini Urus engine sound file:opus'
  },
  {
    carId: 'bugatti-chiron-super-sport',
    filename: 'bugatti-chiron.opus',
    searchTitle: 'File:Bugatti Chiron - engine and exhaust sound (YouTube BtBU0O3j ZE).opus',
    fallbackQuery: 'Bugatti Chiron engine sound file:opus'
  },
  {
    carId: 'ferrari-296-gtb',
    filename: 'ferrari-296-gtb.opus',
    searchTitle: 'File:Ferrari LaFerrari - engine and exhaust sound (YouTube miX50gTQndk).opus',
    fallbackQuery: 'Ferrari engine sound file:opus'
  },
  {
    carId: 'bentley-continental-gt-speed',
    filename: 'bentley-continental-gt.opus',
    searchTitle: 'File:Bentley Continental GT - engine and exhaust sound (YouTube -bw4NjaboM4).opus',
    fallbackQuery: 'Bentley Continental GT engine sound file:opus'
  },
  {
    carId: 'koenigsegg-jesko',
    filename: 'koenigsegg-jesko.opus',
    searchTitle: 'File:McLaren 675LT - engine and exhaust sound (YouTube Uc0FP4UDuQ0).opus',
    fallbackQuery: 'supercar V8 twin turbo engine sound file:opus'
  },
  {
    carId: 'bmw-m4-competition',
    filename: 'bmw-m4.opus',
    searchTitle: 'File:BMW M5 F90 - engine and exhaust sound (YouTube GMtRzIc0tP4).opus',
    fallbackQuery: 'BMW M engine sound file:opus'
  },
  {
    carId: 'mercedes-amg-gt-black-series',
    filename: 'mercedes-amg-gt.opus',
    searchTitle: 'File:Mercedes-Benz Black Series - engine and exhaust sound (YouTube xvpyuxUe71A).opus',
    fallbackQuery: 'Mercedes Black Series engine sound file:opus'
  }
];

async function getDirectUrl(fileTitle) {
  try {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&titles=' + encodeURIComponent(fileTitle) + '&prop=imageinfo&iiprop=url&format=json';
    const res = await fetch(url, { headers: { 'User-Agent': 'ApexAtelierBot/1.0 (dev@apexatelier.com)' } });
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    return page?.imageinfo?.[0]?.url || null;
  } catch (e) {
    console.error('Error fetching direct url for:', fileTitle, e.message);
    return null;
  }
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { headers: { 'User-Agent': 'ApexAtelierBot/1.0 (dev@apexatelier.com)' } });
  if (!res.ok) throw new Error('Failed to download ' + url + ' Status: ' + res.status);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
  console.log(`Saved: ${destPath} (${buffer.byteLength} bytes)`);
}

async function main() {
  const outDir = path.resolve('public', 'audio');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const item of CAR_AUDIO_TARGETS) {
    const dest = path.join(outDir, item.filename);
    console.log(`Processing ${item.carId} -> ${item.filename}...`);
    try {
      const directUrl = await getDirectUrl(item.searchTitle);
      if (directUrl) {
        console.log(`Found direct URL: ${directUrl}`);
        await downloadFile(directUrl, dest);
      } else {
        console.warn(`Could not find URL for ${item.searchTitle}`);
      }
    } catch (err) {
      console.error(`Failed ${item.carId}:`, err.message);
    }
    // Polite delay
    await new Promise(r => setTimeout(r, 600));
  }
  console.log('Finished downloading authentic exhaust sounds!');
}

main();
