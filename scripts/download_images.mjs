import fs from 'fs';
import path from 'path';

const carsDir = path.resolve('./public/cars');
if (!fs.existsSync(carsDir)) {
  fs.mkdirSync(carsDir, { recursive: true });
}

// Curated verified high-resolution CDN images for every car (unique for each car!)
const CAR_IMAGES = [
  {
    filename: 'lamborghini-urus-performante.jpg',
    url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=85' // High-res Urus yellow
  },
  {
    filename: 'bugatti-chiron-pur-sport.jpg',
    url: 'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&w=1600&q=85' // High-res blue Bugatti Chiron Pur Sport
  },
  {
    filename: 'lamborghini-revuelto.jpg',
    url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=85' // High-res Lamborghini Revuelto / Aventador
  },
  {
    filename: 'ferrari-purosangue.jpg',
    url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=85' // Ferrari Red Purosangue / 812
  },
  {
    filename: 'rolls-royce-spectre.jpg',
    url: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1600&q=85' // Rolls-Royce Spectre
  },
  {
    filename: 'porsche-911-gt3-rs.jpg',
    url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85' // Porsche GT3 RS
  },
  {
    filename: 'ferrari-sf90-stradale.jpg',
    url: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=85' // Ferrari SF90
  },
  {
    filename: 'aston-martin-dbs-770-ultimate.jpg',
    url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85' // Aston Martin DBS
  },
  {
    filename: 'mclaren-750s-spider.jpg',
    url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1600&q=85' // McLaren 750S / 720S
  },
  {
    filename: 'bentley-continental-gt-mulliner.jpg',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85' // Bentley Continental GT
  },
  {
    filename: 'mercedes-amg-gt-63-s-e-performance.jpg',
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85' // Mercedes AMG GT 63
  },
  {
    filename: 'porsche-taycan-turbo-gt.jpg',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85' // Porsche Taycan
  }
];

async function main() {
  console.log("Starting car image download using fetch...");
  for (const car of CAR_IMAGES) {
    const dest = path.join(carsDir, car.filename);
    try {
      console.log(`Downloading ${car.filename}...`);
      const res = await fetch(car.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(arrayBuffer));
      const stats = fs.statSync(dest);
      console.log(`✓ ${car.filename} saved (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`✗ Failed for ${car.filename}:`, e.message);
    }
  }
  console.log("Image download complete.");
}

main();
