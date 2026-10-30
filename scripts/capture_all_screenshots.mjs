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

// Ensure directories exist
for (const dir of Object.values(DIRS)) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Launching Chrome for Automated Screenshots...');
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

  // ==========================================
  // 1. DESKTOP CAPTURES (1536 x 900)
  // ==========================================
  console.log('📸 Capturing Desktop Screenshots (1536 x 900)...');
  await page.setViewport({ width: 1536, height: 900, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 01. Desktop Hero
  await page.screenshot({ path: path.join(DIRS.desktop, '01-hero-section.png') });
  console.log('  ✓ 01-hero-section.png');

  // 02. Desktop Marques
  await page.evaluate(() => {
    document.getElementById('brands')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.desktop, '02-marques-categories.png') });
  console.log('  ✓ 02-marques-categories.png');

  // 03. Desktop Gallery
  await page.evaluate(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '03-collection-gallery.png') });
  console.log('  ✓ 03-collection-gallery.png');

  // 04. Desktop Car Details Modal
  await page.evaluate(() => {
    // Click on the first car card "Inspect Dossier"
    const buttons = Array.from(document.querySelectorAll('button'));
    const dossierBtn = buttons.find(b => b.textContent?.includes('Inspect') || b.textContent?.includes('Dossier'));
    if (dossierBtn) dossierBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(DIRS.desktop, '04-car-details-modal.png') });
  console.log('  ✓ 04-car-details-modal.png');

  // Close modal
  await page.keyboard.press('Escape');
  await sleep(600);

  // 05. Desktop Drag Race Simulator
  await page.evaluate(() => {
    // Click tools or drag strip button
    const buttons = Array.from(document.querySelectorAll('button'));
    const dragBtn = buttons.find(b => b.textContent?.includes('Drag Strip') || b.title?.includes('Drag Strip'));
    if (dragBtn) dragBtn.click();
    else {
      // Find Tools dropdown
      const toolsBtn = buttons.find(b => b.textContent?.includes('Tools') || b.textContent?.includes('Interactive'));
      if (toolsBtn) toolsBtn.click();
    }
  });
  await sleep(500);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dragBtn = buttons.find(b => b.textContent?.includes('Drag Strip') || b.textContent?.includes('0–100'));
    if (dragBtn) dragBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '05-drag-race-simulator.png') });
  console.log('  ✓ 05-drag-race-simulator.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 06. Desktop Exhaust Rev Arena
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const revArenaBtn = buttons.find(b => b.textContent?.includes('Rev Exhaust') || b.textContent?.includes('Rev Arena') || b.textContent?.includes('Sound Lounge'));
    if (revArenaBtn) revArenaBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '06-exhaust-rev-arena.png') });
  console.log('  ✓ 06-exhaust-rev-arena.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 07. Desktop Finance Calculator
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const finBtn = buttons.find(b => b.textContent?.includes('Finance') || b.textContent?.includes('EMI') || b.title?.includes('EMI'));
    if (finBtn) finBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '07-finance-calculator.png') });
  console.log('  ✓ 07-finance-calculator.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 08. Desktop Atelier About
  await page.evaluate(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.desktop, '08-atelier-about.png') });
  console.log('  ✓ 08-atelier-about.png');

  // 09. Desktop Contact & Concierge
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.desktop, '09-contact-concierge.png') });
  console.log('  ✓ 09-contact-concierge.png');

  // 10. Desktop Footer
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.desktop, '10-footer.png') });
  console.log('  ✓ 10-footer.png');


  // ==========================================
  // 2. TABLET CAPTURES (820 x 1180 — iPad Air)
  // ==========================================
  console.log('📸 Capturing Tablet Screenshots (820 x 1180)...');
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 01. Tablet Hero
  await page.screenshot({ path: path.join(DIRS.tablet, '01-tablet-hero.png') });
  console.log('  ✓ 01-tablet-hero.png');

  // 02. Tablet Marques
  await page.evaluate(() => {
    document.getElementById('brands')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.tablet, '02-tablet-marques.png') });
  console.log('  ✓ 02-tablet-marques.png');

  // 03. Tablet Gallery
  await page.evaluate(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '03-tablet-gallery.png') });
  console.log('  ✓ 03-tablet-gallery.png');

  // 04. Tablet Car Details Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dossierBtn = buttons.find(b => b.textContent?.includes('Inspect') || b.textContent?.includes('Dossier'));
    if (dossierBtn) dossierBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(DIRS.tablet, '04-tablet-car-details.png') });
  console.log('  ✓ 04-tablet-car-details.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 05. Tablet Drag Race
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dragBtn = buttons.find(b => b.textContent?.includes('Drag Strip') || b.title?.includes('Drag Strip'));
    if (dragBtn) dragBtn.click();
    else {
      const toolsBtn = buttons.find(b => b.textContent?.includes('Tools'));
      if (toolsBtn) toolsBtn.click();
    }
  });
  await sleep(500);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dragBtn = buttons.find(b => b.textContent?.includes('Drag Strip') || b.textContent?.includes('0–100'));
    if (dragBtn) dragBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '05-tablet-drag-race.png') });
  console.log('  ✓ 05-tablet-drag-race.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 06. Tablet Finance Calculator
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const finBtn = buttons.find(b => b.textContent?.includes('Finance') || b.textContent?.includes('EMI'));
    if (finBtn) finBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '06-tablet-finance-calculator.png') });
  console.log('  ✓ 06-tablet-finance-calculator.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 07. Tablet About
  await page.evaluate(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.tablet, '07-tablet-about.png') });
  console.log('  ✓ 07-tablet-about.png');

  // 08. Tablet Contact
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.tablet, '08-tablet-contact.png') });
  console.log('  ✓ 08-tablet-contact.png');


  // ==========================================
  // 3. MOBILE CAPTURES (390 x 844 — iPhone 14/15)
  // ==========================================
  console.log('📸 Capturing Mobile Screenshots (390 x 844)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 01. Mobile Hero
  await page.screenshot({ path: path.join(DIRS.mobile, '01-mobile-hero.png') });
  console.log('  ✓ 01-mobile-hero.png');

  // 02. Mobile Navigation Drawer
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.mobile, '02-mobile-navigation-drawer.png') });
  console.log('  ✓ 02-mobile-navigation-drawer.png');

  // Close burger menu
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(600);

  // 03. Mobile Gallery
  await page.evaluate(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '03-mobile-gallery.png') });
  console.log('  ✓ 03-mobile-gallery.png');

  // 04. Mobile Car Details Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dossierBtn = buttons.find(b => b.textContent?.includes('Inspect') || b.textContent?.includes('Dossier'));
    if (dossierBtn) dossierBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(DIRS.mobile, '04-mobile-car-details.png') });
  console.log('  ✓ 04-mobile-car-details.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 05. Mobile Drag Race
  await page.evaluate(() => {
    // Open burger first to access tools on mobile
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(600);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dragBtn = buttons.find(b => b.textContent?.includes('Drag Strip'));
    if (dragBtn) dragBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '05-mobile-drag-race.png') });
  console.log('  ✓ 05-mobile-drag-race.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 06. Mobile Rev Battle
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(600);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const revBtn = buttons.find(b => b.textContent?.includes('Rev Battle') || b.textContent?.includes('Sound Lounge'));
    if (revBtn) revBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '06-mobile-rev-arena.png') });
  console.log('  ✓ 06-mobile-rev-arena.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 07. Mobile Finance Calculator
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(600);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const finBtn = buttons.find(b => b.textContent?.includes('EMI') || b.textContent?.includes('Finance'));
    if (finBtn) finBtn.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(DIRS.mobile, '07-mobile-finance-calculator.png') });
  console.log('  ✓ 07-mobile-finance-calculator.png');
  await page.keyboard.press('Escape');
  await sleep(600);

  // 08. Mobile Contact & Concierge
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(800);
  await page.screenshot({ path: path.join(DIRS.mobile, '08-mobile-contact.png') });
  console.log('  ✓ 08-mobile-contact.png');

  await browser.close();
  console.log('✨ All Screenshots Captured Successfully!');
}

run().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
