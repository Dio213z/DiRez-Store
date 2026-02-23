const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve('index.html');
  await page.goto(filePath);

  // Click PUBG card
  await page.click('.game-card:has-text("PUBG Mobile")');
  await page.waitForTimeout(1000); // Wait for transition

  // Click first UC package
  await page.click('.price-item:has-text("60 UC")');
  await page.waitForTimeout(1000); // Wait for scroll

  const scrollY = await page.evaluate(() => document.querySelector('.wrapper').scrollTop);
  console.log('Scroll position after selecting PUBG UC:', scrollY);

  await page.screenshot({ path: 'pubg_scroll.png' });
  await browser.close();
})();
