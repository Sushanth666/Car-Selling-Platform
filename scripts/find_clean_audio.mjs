async function searchFiles(term) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(term) + '&srnamespace=6&format=json';
  const res = await fetch(url, { headers: { 'User-Agent': 'ApexBot/1.0' } });
  const data = await res.json();
  console.log(`=== ${term} ===`);
  (data.query?.search || []).slice(0, 15).forEach(m => console.log(' * ' + m.title));
}

async function run() {
  await searchFiles('McLaren file:ogg');
  await searchFiles('Bugatti file:ogg');
  await searchFiles('Aston Martin file:ogg');
  await searchFiles('BMW file:ogg');
  await searchFiles('Mercedes file:ogg');
  await searchFiles('Rolls-Royce file:ogg');
  await searchFiles('Bentley file:ogg');
}

run();
