const { test, expect } = require('@playwright/test');
const path = require('path');

test('Cash payment method adds 1000 fee', async ({ page }) => {
  const filePath = `file://${path.resolve('index.html')}`;
  await page.goto(filePath);

  // Select a game (Mobile Legends)
  await page.click('.game-card:has-text("Mobile Legends")');

  // Select a package (e.g., 5 Diamonds)
  await page.waitForSelector('.price-item:has-text("💎 5")');
  const priceItem = page.locator('.price-item:has-text("💎 5")');
  const priceText = await priceItem.locator('.price-rupiah').textContent();
  const basePrice = parseInt(priceText.replace(/[^0-9]/g, ''));
  await priceItem.click();

  // Check initial total
  const summaryTotal = page.locator('#summaryTotal');
  await expect(summaryTotal).toHaveText(`Rp${basePrice.toLocaleString('id-ID')}`);

  // Select GoPay (no fee)
  await page.click('.payment-option[data-method="gopay"]');
  await expect(summaryTotal).toHaveText(`Rp${basePrice.toLocaleString('id-ID')}`);
  await expect(page.locator('#cashFeeLabel')).not.toBeVisible();

  // Select Cash (should add 1000)
  await page.click('.payment-option[data-method="cash"]');
  const expectedTotal = basePrice + 1000;
  await expect(summaryTotal).toHaveText(`Rp${expectedTotal.toLocaleString('id-ID')}`);
  await expect(page.locator('#cashFeeLabel')).toBeVisible();

  // Select Dana (should remove 1000)
  await page.click('.payment-option[data-method="dana"]');
  await expect(summaryTotal).toHaveText(`Rp${basePrice.toLocaleString('id-ID')}`);
  await expect(page.locator('#cashFeeLabel')).not.toBeVisible();
});
