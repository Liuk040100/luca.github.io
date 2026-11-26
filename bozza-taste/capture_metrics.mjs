import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

async function run() {
  const chromePath = '/home/fidai/.cache/puppeteer/chrome/linux-146.0.7680.31/chrome-linux64/chrome';
  const shotsDir = path.resolve('../shots');
  fs.mkdirSync(shotsDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const sizes = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1024x768', width: 1024, height: 768 },
    { name: '390x844', width: 390, height: 844 },
    { name: '390x664', width: 390, height: 664 },
    { name: '375x667', width: 375, height: 667 },
    { name: '320x640', width: 320, height: 640 }
  ];

  for (const s of sizes) {
    const context = await browser.newContext({ viewport: { width: s.width, height: s.height } });
    const page = await context.newPage();
    const url = 'file://' + path.resolve('index.html');
    await page.goto(url, { waitUntil: 'networkidle' });

    // 1. Percorso slide 3
    await page.evaluate(() => {
      const el = document.querySelector('#percorso');
      if (el) el.scrollIntoView();
    });
    // Seleziona la slide 3 se esiste un meccanismo o clicca/attiva
    // Oppure valutiamo le misure DOM
    const metrics = await page.evaluate(() => {
      const contactEl = document.querySelector('#contact');
      const phEl = document.querySelector('#percorso');
      const stageEl = phEl ? phEl.querySelector('.mo-ph__stage') : null;
      const panelEl = phEl ? phEl.querySelector('.mo-ph__panel') : null;
      
      return {
        vw: window.innerWidth,
        vh: window.innerHeight,
        footerGap: contactEl ? contactEl.getBoundingClientRect().top : null,
        phClearTop: phEl ? phEl.getBoundingClientRect().top : null,
        phStageH: stageEl ? stageEl.getBoundingClientRect().height : null,
        phPanelH: panelEl ? panelEl.getBoundingClientRect().height : null,
        swLeVw: window.innerWidth <= window.outerWidth
      };
    });
    console.log(`Size ${s.name}:`, metrics);

    if (s.name === '390x664') {
      // scroll to percorso slide 3 & 4
      await page.evaluate(() => {
        const chs = document.querySelectorAll('.mo-ph__ch');
        if (chs[2]) chs[2].scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(shotsDir, 'mobile-390x664-percorso3.png') });

      await page.evaluate(() => {
        const chs = document.querySelectorAll('.mo-ph__ch');
        if (chs[3]) chs[3].scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(shotsDir, 'mobile-390x664-percorso4.png') });
    }

    if (s.name === '375x667') {
      await page.evaluate(() => {
        const c = document.querySelector('#contact');
        if (c) c.scrollIntoView();
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(shotsDir, 'mobile-375x667-footer.png') });
    }

    if (s.name === '1440x900') {
      await page.evaluate(() => {
        const chs = document.querySelectorAll('.mo-ph__ch');
        if (chs[2]) chs[2].scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(shotsDir, 'desktop-1440-percorso3.png') });

      await page.evaluate(() => {
        const chs = document.querySelectorAll('.mo-ph__ch');
        if (chs[3]) chs[3].scrollIntoView({ behavior: 'smooth' });
      });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(shotsDir, 'desktop-1440-percorso4.png') });
    }

    await context.close();
  }

  await browser.close();
}

run().catch(console.err);
