const { test, expect } = require('@playwright/test');
const path = require('path');

test('Verify new special services section and search functionality', async ({ page }) => {
  // Use absolute file path for local file access
  const filePath = `file://${path.resolve(__dirname, '../index.html')}`;
  await page.goto(filePath);

  // Check if the new special services section exists
  const specialServicesSection = page.locator('#special-services');
  await expect(specialServicesSection).toBeVisible();

  // Check if the title is correct
  const sectionTitle = specialServicesSection.locator('.section-title');
  await expect(sectionTitle).toHaveText('📦 Jasa & Kebutuhan JB');

  // Check if the new cards are rendered in the special services grid
  const specialServicesGrid = page.locator('#specialServicesGrid');
  await expect(specialServicesGrid.locator('.game-card')).toHaveCount(1);

  // Verify specific card names
  const cardNames = await specialServicesGrid.locator('.game-name').allTextContents();
  expect(cardNames).toContain('MENU JASTEB BY DiRez Store');
  expect(cardNames).not.toContain('JB Kebutuhan Akun');
  expect(cardNames).not.toContain('Aplikasi Anak JB');

  // Verify search functionality for special services
  const searchInput = page.locator('#searchInput');
  await searchInput.fill('JASTEB');

  const searchDropdown = page.locator('#searchDropdown');
  await expect(searchDropdown).toHaveClass(/active/);

  const searchItems = await searchDropdown.locator('.search-item').allTextContents();
  expect(searchItems.some(item => item.includes('MENU JASTEB BY DiRez Store'))).toBeTruthy();
  expect(searchItems.some(item => item.includes('JB Kebutuhan Akun'))).toBeFalsy();
  expect(searchItems.some(item => item.includes('Aplikasi Anak JB'))).toBeFalsy();

  // Verify clicking a card shows prices
  await specialServicesGrid.locator('.game-card', { hasText: 'MENU JASTEB BY DiRez Store' }).click();

  const priceSection = page.locator('#priceSection');
  await expect(priceSection).toHaveClass(/active/);

  const priceHeader = page.locator('#priceTitle');
  await expect(priceHeader).toHaveText('Pilih Paket MENU JASTEB BY DiRez Store');

  const priceItems = await page.locator('#priceGrid .price-item').count();
  expect(priceItems).toBeGreaterThan(0);
});
