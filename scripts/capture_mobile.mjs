import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const mobileDir = path.resolve('screenshots/mobile');

if (!fs.existsSync(mobileDir)) {
  fs.mkdirSync(mobileDir, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('📱 Launching Mobile Screenshots Capture (390 x 844)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await sleep(2000);

  // 01. Mobile Hero
  await page.screenshot({ path: path.join(mobileDir, '01-mobile-hero.png') });
  console.log('  ✓ 01-mobile-hero.png');

  // 02. Mobile Navigation Drawer
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(mobileDir, '02-mobile-navigation-drawer.png') });
  console.log('  ✓ 02-mobile-navigation-drawer.png');

  // Close burger menu
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(800);

  // 03. Mobile Gallery
  await page.evaluate(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(mobileDir, '03-mobile-gallery.png') });
  console.log('  ✓ 03-mobile-gallery.png');

  // 04. Mobile Car Details Modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dossierBtn = buttons.find(b => b.textContent?.includes('Inspect') || b.textContent?.includes('Dossier'));
    if (dossierBtn) dossierBtn.click();
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(mobileDir, '04-mobile-car-details.png') });
  console.log('  ✓ 04-mobile-car-details.png');
  await page.keyboard.press('Escape');
  await sleep(800);

  // 05. Mobile Drag Race
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(800);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dragBtn = buttons.find(b => b.textContent?.includes('Drag Strip'));
    if (dragBtn) dragBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(mobileDir, '05-mobile-drag-race.png') });
  console.log('  ✓ 05-mobile-drag-race.png');
  await page.keyboard.press('Escape');
  await sleep(800);

  // 06. Mobile Rev Battle
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(800);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const revBtn = buttons.find(b => b.textContent?.includes('Rev Battle') || b.textContent?.includes('Sound Lounge'));
    if (revBtn) revBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(mobileDir, '06-mobile-rev-arena.png') });
  console.log('  ✓ 06-mobile-rev-arena.png');
  await page.keyboard.press('Escape');
  await sleep(800);

  // 07. Mobile Finance Calculator
  await page.evaluate(() => {
    const burger = document.querySelector('button[aria-label="Toggle menu"]');
    if (burger) burger.click();
  });
  await sleep(800);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const finBtn = buttons.find(b => b.textContent?.includes('EMI') || b.textContent?.includes('Finance'));
    if (finBtn) finBtn.click();
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(mobileDir, '07-mobile-finance-calculator.png') });
  console.log('  ✓ 07-mobile-finance-calculator.png');
  await page.keyboard.press('Escape');
  await sleep(800);

  // 08. Mobile Contact & Concierge
  await page.evaluate(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await sleep(1000);
  await page.screenshot({ path: path.join(mobileDir, '08-mobile-contact.png') });
  console.log('  ✓ 08-mobile-contact.png');

  await browser.close();
  console.log('✨ Mobile screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
