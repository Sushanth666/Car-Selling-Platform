import fs from 'fs';

const filePath = 'src/data/cars.js';
let content = fs.readFileSync(filePath, 'utf8');

const carIds = [
  'porsche-911-gt3-rs',
  'ferrari-sf90-stradale',
  'lamborghini-revuelto',
  'rolls-royce-spectre',
  'aston-martin-dbs-770-ultimate',
  'mclaren-750s-spider',
  'lamborghini-urus-performante',
  'ferrari-purosangue',
  'bentley-continental-gt-mulliner',
  'mercedes-amg-gt-63-s-e-performance',
  'bugatti-chiron-pur-sport',
  'porsche-taycan-turbo-gt'
];

carIds.forEach(id => {
  // Replace empty /cars/.jpg or wrong path for each car block
  const blockRegex = new RegExp(`id:\\s*["']${id}["'][\\s\\S]*?vin:\\s*["'][^"']+["']`, 'g');
  content = content.replace(blockRegex, (block) => {
    // replace heroImage
    block = block.replace(/heroImage:\s*["'][^"']*["']/, `heroImage: "/cars/${id}.jpg"`);
    // replace first gallery item if it starts with /cars/
    block = block.replace(/gallery:\s*\[\s*["']\/cars\/[^"']*["']/, `gallery: [\n      "/cars/${id}.jpg"`);
    return block;
  });
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated all car image paths in src/data/cars.js');
