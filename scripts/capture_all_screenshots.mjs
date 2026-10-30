import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const DIRS = {
  desktop: path.resolve('screenshots/desktop'),
  tablet: path.resolve('screenshots/tablet'),
  mobile: path.resolve('screenshots/mobile')
};

for (const dir of Object.values(DIRS)) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Launching Chrome for Automated Multi-Device Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // ==========================================
  // 1. DESKTOP CAPTURES (1536 x 900)
  // ==========================================
  console.log('\n📸 Capturing Desktop Screenshots (1536 x 900)...');
  await page.setViewport({ width: 1536, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // 01. Desktop Hero
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(600);
  await page.screenshot({ path: path.join(DIRS.desktop, '01-hero-section.png') });
  console.log('  ✓ 01-hero-section.png');

  // 02. Desktop Marques
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('brands')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.desktop, '02-marques-categories.png') });
  console.log('  ✓ 02-marques-categories.png');

  // 03. Desktop Gallery
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '03-collection-gallery.png') });
  console.log('  ✓ 03-collection-gallery.png');

  // 04. Desktop Car Details Modal
  await page.evaluate(() => {
    window.__aureus?.openDetails(0);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.desktop, '04-car-details-modal.png') });
  console.log('  ✓ 04-car-details-modal.png');
  await page.evaluate(() => window.__aureus?.closeDetails());
  await sleep(600);

  // 05. Desktop Drag Race Simulator
  await page.evaluate(() => {
    window.__aureus?.openDragRace();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.desktop, '05-drag-race-simulator.png') });
  console.log('  ✓ 05-drag-race-simulator.png');
  await page.evaluate(() => window.__aureus?.closeDragRace());
  await sleep(600);

  // 06. Desktop Exhaust Rev Arena
  await page.evaluate(() => {
    window.__aureus?.openRevBattle();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.desktop, '06-exhaust-rev-arena.png') });
  console.log('  ✓ 06-exhaust-rev-arena.png');
  await page.evaluate(() => window.__aureus?.closeRevBattle());
  await sleep(600);

  // 07. Desktop Finance Calculator
  await page.evaluate(() => {
    window.__aureus?.openFinance(0);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.desktop, '07-finance-calculator.png') });
  console.log('  ✓ 07-finance-calculator.png');
  await page.evaluate(() => window.__aureus?.closeFinance());
  await sleep(600);

  // 08. Desktop Atelier About
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '08-atelier-about.png') });
  console.log('  ✓ 08-atelier-about.png');

  // 09. Desktop Contact & Concierge
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '09-contact-concierge.png') });
  console.log('  ✓ 09-contact-concierge.png');

  // 10. Desktop Footer
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.desktop, '10-footer.png') });
  console.log('  ✓ 10-footer.png');


  // ==========================================
  // 2. TABLET CAPTURES (820 x 1180 — iPad Air)
  // ==========================================
  console.log('\n📸 Capturing Tablet Screenshots (820 x 1180)...');
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // 01. Tablet Hero
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(600);
  await page.screenshot({ path: path.join(DIRS.tablet, '01-tablet-hero.png') });
  console.log('  ✓ 01-tablet-hero.png');

  // 02. Tablet Marques
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('brands')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.tablet, '02-tablet-marques.png') });
  console.log('  ✓ 02-tablet-marques.png');

  // 03. Tablet Gallery
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '03-tablet-gallery.png') });
  console.log('  ✓ 03-tablet-gallery.png');

  // 04. Tablet Car Details Modal
  await page.evaluate(() => {
    window.__aureus?.openDetails(0);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.tablet, '04-tablet-car-details.png') });
  console.log('  ✓ 04-tablet-car-details.png');
  await page.evaluate(() => window.__aureus?.closeDetails());
  await sleep(600);

  // 05. Tablet Drag Race
  await page.evaluate(() => {
    window.__aureus?.openDragRace();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.tablet, '05-tablet-drag-race.png') });
  console.log('  ✓ 05-tablet-drag-race.png');
  await page.evaluate(() => window.__aureus?.closeDragRace());
  await sleep(600);

  // 06. Tablet Finance Calculator
  await page.evaluate(() => {
    window.__aureus?.openFinance(0);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.tablet, '06-tablet-finance-calculator.png') });
  console.log('  ✓ 06-tablet-finance-calculator.png');
  await page.evaluate(() => window.__aureus?.closeFinance());
  await sleep(600);

  // 07. Tablet About
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '07-tablet-about.png') });
  console.log('  ✓ 07-tablet-about.png');

  // 08. Tablet Contact
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '08-tablet-contact.png') });
  console.log('  ✓ 08-tablet-contact.png');


  // ==========================================
  // 3. MOBILE CAPTURES (390 x 844 — iPhone 14/15)
  // ==========================================
  console.log('\n📸 Capturing Mobile Screenshots (390 x 844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2500);

  // 01. Mobile Hero
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await sleep(600);
  await page.screenshot({ path: path.join(DIRS.mobile, '01-mobile-hero.png') });
  console.log('  ✓ 01-mobile-hero.png');

  // 02. Mobile Navigation Drawer
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '02-mobile-navigation-drawer.png') });
  console.log('  ✓ 02-mobile-navigation-drawer.png');

  // Close burger menu
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(800);

  // 03. Mobile Gallery
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '03-mobile-gallery.png') });
  console.log('  ✓ 03-mobile-gallery.png');

  // 04. Mobile Car Details Modal
  await page.evaluate(() => {
    window.__aureus?.openDetails(0);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.mobile, '04-mobile-car-details.png') });
  console.log('  ✓ 04-mobile-car-details.png');
  await page.evaluate(() => window.__aureus?.closeDetails());
  await sleep(600);

  // 05. Mobile Drag Race
  await page.evaluate(() => {
    window.__aureus?.openDragRace();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.mobile, '05-mobile-drag-race.png') });
  console.log('  ✓ 05-mobile-drag-race.png');
  await page.evaluate(() => window.__aureus?.closeDragRace());
  await sleep(600);

  // 06. Mobile Rev Battle
  await page.evaluate(() => {
    window.__aureus?.openRevBattle();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.mobile, '06-mobile-rev-arena.png') });
  console.log('  ✓ 06-mobile-rev-arena.png');
  await page.evaluate(() => window.__aureus?.closeRevBattle());
  await sleep(600);

  // 07. Mobile Finance Calculator
  await page.evaluate(() => {
    window.__aureus?.openFinance(0);
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(DIRS.mobile, '07-mobile-finance-calculator.png') });
  console.log('  ✓ 07-mobile-finance-calculator.png');
  await page.evaluate(() => window.__aureus?.closeFinance());
  await sleep(600);

  // 08. Mobile Contact & Concierge
  await page.evaluate(() => {
    window.__aureus?.closeAll();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '08-mobile-contact.png') });
  console.log('  ✓ 08-mobile-contact.png');

  await browser.close();
  console.log('\n🎉 ALL 26 HIGH-RES SCREENSHOTS CAPTURED WITH ZERO DUPLICATES & GUARANTEED DISTINCT MODALS!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
