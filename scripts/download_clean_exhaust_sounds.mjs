import fs from 'fs';
import path from 'path';

const CLEAN_AUDIO_MAP = [
  {
    carId: 'porsche-911-gt3-rs',
    filename: 'porsche-911-gt3-rs.ogg',
    wikiTitle: 'File:Porsche 997 GT3 RS.ogg'
  },
  {
    carId: 'ferrari-sf90-stradale',
    filename: 'ferrari-sf90.ogg',
    wikiTitle: 'File:Ferrari F430 (2010).ogg'
  },
  {
    carId: 'lamborghini-revuelto',
    filename: 'lamborghini-revuelto.ogg',
    wikiTitle: 'File:Lamborghini Aventador LP700-4 (2011).ogg'
  },
  {
    carId: 'mclaren-750s-spider',
    filename: 'mclaren-750s.ogg',
    wikiTitle: 'File:McLaren MP4-12C.ogg'
  },
  {
    carId: 'bugatti-chiron-pur-sport',
    filename: 'bugatti-chiron.ogg',
    wikiTitle: 'File:Bugatti Veyron Pur Sang.ogg'
  },
  {
    carId: 'aston-martin-dbx707',
    filename: 'aston-martin-dbx.ogg',
    wikiTitle: 'File:Aston-Martin-V12-Vantage.ogg'
  },
  {
    carId: 'bmw-m4-competition',
    filename: 'bmw-m4.ogg',
    wikiTitle: 'File:BMW M3 GT2 (2010).ogg'
  },
  {
    carId: 'mercedes-amg-gt-black-series',
    filename: 'mercedes-amg-gt.ogg',
    wikiTitle: 'File:Mercedes-Benz SLR McLaren 722.ogg'
  },
  {
    carId: 'lamborghini-urus-performante',
    filename: 'lamborghini-urus.ogg',
    wikiTitle: 'File:Lamborghini Gallardo LP570-4 Superleggera.ogg'
  },
  {
    carId: 'rolls-royce-cullinan',
    filename: 'rolls-royce-cullinan.ogg',
    wikiTitle: 'File:Aston Martin Rapide (2010).ogg'
  },
  {
    carId: 'ferrari-296-gtb',
    filename: 'ferrari-296.ogg',
    wikiTitle: 'File:Ferrari California (2009).ogg'
  },
  {
    carId: 'bentley-continental-gt-speed',
    filename: 'bentley-continental-gt.ogg',
    wikiTitle: 'File:Bugatti Veyron Grand Sport.ogg'
  },
  {
    carId: 'koenigsegg-jesko',
    filename: 'koenigsegg-jesko.ogg',
    wikiTitle: 'File:McLaren-BMW F1 GTR (1995).ogg'
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
  console.log(`Saved: ${path.basename(destPath)} (${buffer.byteLength} bytes)`);
}

async function main() {
  const outDir = path.resolve('public', 'audio');
  for (const item of CLEAN_AUDIO_MAP) {
    const dest = path.join(outDir, item.filename);
    console.log(`Downloading pure exhaust for ${item.carId}...`);
    try {
      const directUrl = await getDirectUrl(item.wikiTitle);
      if (directUrl) {
        await downloadFile(directUrl, dest);
      } else {
        console.warn('Could not find URL for ' + item.wikiTitle);
      }
    } catch (e) {
      console.error(`Failed ${item.carId}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 700));
  }
  console.log('Finished downloading pure exhaust sound library!');
}

main();
