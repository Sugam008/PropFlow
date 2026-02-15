import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the properties API
    await page.route('**/api/v1/properties/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'prop_123',
            address: '123 Main St',
            city: 'Mumbai',
            status: 'pending',
            photos: [],
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });
  });

  for (const viewport of viewports) {
    test(`Check layout on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Wait for the page to load
      await expect(page.getByText('Valuation Queue').first()).toBeVisible();

      // Check Sidebar visibility
      const sidebar = page.locator('aside');
      if (viewport.width < 1024) {
        // Sidebar should be off-screen (left: -260px)
        const box = await sidebar.boundingBox();
        if (box) {
          expect(box.x).toBeLessThan(0);
        }
        
        // Menu button should be visible in TopBar
        await expect(page.getByLabel('Open menu')).toBeVisible();
      } else {
        await expect(sidebar).toBeVisible();
        const box = await sidebar.boundingBox();
        if (box) {
          expect(box.x).toBe(0);
        }
      }

      // Check TopBar visibility
      await expect(page.locator('header').first()).toBeVisible();

      // Check main content area
      await expect(page.locator('main')).toBeVisible();

      // Check if table is scrollable or responsive on small screens
      if (viewport.width < 600) {
        // Check for any horizontal scrollable elements (tables)
        const tableContainer = page.locator('div.overflow-x-auto');
        if (await tableContainer.count() > 0) {
          await expect(tableContainer.first()).toBeVisible();
        }
      }
    });
  }
});
