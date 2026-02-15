import { test, expect } from '@playwright/test';

test.describe('Valuer Workflow', () => {
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
          {
            id: 'prop_456',
            address: '456 Park Ave',
            city: 'Delhi',
            status: 'pending',
            photos: [],
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    // Mock individual property detail
    await page.route('**/api/v1/properties/prop_123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'prop_123',
          address: '123 Main St',
          city: 'Mumbai',
          status: 'pending',
          photos: [],
          created_at: new Date().toISOString(),
          property_type: 'Apartment',
          area_sqft: 1200,
          bedrooms: 2,
          bathrooms: 2,
        }),
      });
    });

    // Mock valuations API
    await page.route('**/api/v1/valuations/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/');
  });

  test('should display the property queue and allow searching', async ({ page }) => {
    // Check if the page title or header is visible
    await expect(page.getByText('Valuation Queue').first()).toBeVisible();

    // Check if properties are rendered
    await expect(page.getByText('123 Main St').first()).toBeVisible();
    await expect(page.getByText('456 Park Ave').first()).toBeVisible();

    // Test search functionality
    const searchInput = page.getByPlaceholder('Search queue...');
    await searchInput.fill('123');
    await expect(page.getByText('123 Main St').first()).toBeVisible();
    await expect(page.getByText('456 Park Ave')).not.toBeVisible();
  });

  test('should navigate to property detail and perform actions', async ({ page }) => {
    // Click on a property to navigate
    await page.getByText('123 Main St').first().click();

    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/prop_123/);
    await expect(page.getByText('Property Details').first()).toBeVisible();
    await expect(page.getByText('123 Main St').first()).toBeVisible();

    // Test Approve action
    const approveButton = page.getByRole('button', { name: /Approve Valuation/i });
    await expect(approveButton).toBeVisible();
    await approveButton.click();
  });

  test('should open follow-up modal', async ({ page }) => {
    await page.getByText('123 Main St').first().click();
    
    const followUpButton = page.getByRole('button', { name: /Request Follow-up/i });
    await followUpButton.click();
    
    // Check if modal opens
    await expect(page.getByText('Request Follow-up').last()).toBeVisible();
    await expect(page.getByText('Instructions for Customer')).toBeVisible();
  });
});
