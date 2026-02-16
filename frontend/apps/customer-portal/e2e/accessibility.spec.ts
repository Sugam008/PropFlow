import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audit', () => {
  test('should not have any automatically detectable accessibility issues on Home page', async ({
    page,
  }) => {
    // Mock API responses
    await page.route('**/properties/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'prop_1',
            address: '123 Test Lane',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            property_type: 'APARTMENT',
            status: 'SUBMITTED',
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto('/');

    // Wait for the content to load
    await expect(page.getByText('Welcome back, Valuer')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have any automatically detectable accessibility issues on Property Detail page', async ({
    page,
  }) => {
    const propId = 'prop_1';

    // Mock API responses
    await page.route(`**/properties/${propId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: propId,
          address: '123 Test Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          property_type: 'APARTMENT',
          status: 'SUBMITTED',
          created_at: new Date().toISOString(),
          lat: 19.076,
          lng: 72.8777,
        }),
      });
    });

    await page.route(`**/properties/${propId}/photos`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/comps/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/properties', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: propId,
            address: '123 Test Lane',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            property_type: 'APARTMENT',
            status: 'SUBMITTED',
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto(`/${propId}`);

    // Wait for the loader to disappear and content to load
    await expect(page.getByText('Loading property details...')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: '123 Test Lane' })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have any automatically detectable accessibility issues on Analytics page', async ({
    page,
  }) => {
    // Mock API responses
    await page.route('**/properties/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'prop_1',
            address: '123 Test Lane',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            property_type: 'APARTMENT',
            status: 'VALUED',
            estimated_value: 5000000,
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto('/analytics');

    // Wait for the content to load
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
