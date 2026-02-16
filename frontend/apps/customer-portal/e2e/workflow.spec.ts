import { test, expect } from '@playwright/test';

test.describe('Customer Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Auth API
    await page.route('**/api/v1/auth/otp/request', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route('**/api/v1/auth/otp/verify', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake_token',
          user: {
            id: 'user_123',
            phone: '+919999900001',
            role: 'CUSTOMER',
            name: 'Demo User',
          },
        }),
      });
    });

    // Mock Properties API
    await page.route('**/api/v1/properties/', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'prop_123' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'prop_123',
              address: '123 Main St',
              city: 'Mumbai',
              state: 'Maharashtra',
              pincode: '400001',
              status: 'pending',
              created_at: new Date().toISOString(),
            },
          ]),
        });
      }
    });

    await page.route('**/api/v1/properties/prop_123/photos', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route('**/api/v1/properties/prop_123/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock Property Detail
    await page.route('**/api/v1/properties/prop_123', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'prop_123',
          address: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          status: 'pending',
          property_type: 'APARTMENT',
          area_sqft: 1000,
          created_at: new Date().toISOString(),
        }),
      });
    });
  });

  test('full customer journey: login -> create valuation -> dashboard', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="tel"]', '9999900001');
    await page.click('button:has-text("Send OTP")');
    await expect(page.getByText('Enter the OTP')).toBeVisible();

    await page.fill('input[placeholder="Enter the 6-digit code"]', '123456');
    await page.click('button:has-text("Verify OTP")');

    // Expect to be on dashboard
    await expect(page).toHaveURL('/');

    // 2. Start New Valuation
    // Use a more robust selector if needed, assuming sidebar link
    await page.getByRole('link', { name: 'New Valuation' }).click();
    await expect(page).toHaveURL('/new');

    // Step 1: Property Type
    await page.getByText('Apartment').click();
    // Should auto-advance to details
    await expect(page).toHaveURL('/new/details');

    // Step 2: Details
    await page.getByLabel('Area (sq ft)').fill('1000');
    await page.getByLabel('Property Age (years)').fill('5');
    await page.getByLabel('Bedrooms').fill('2');
    await page.getByLabel('Bathrooms').fill('2');
    await page.getByLabel('Floor No.').fill('1');
    await page.getByLabel('Total Floors').fill('5');
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/new/location');

    // Step 3: Location
    await page.getByLabel('Address').fill('123 Main St');
    await page.getByLabel('City').fill('Mumbai');
    await page.getByLabel('State').fill('Maharashtra');
    await page.getByLabel('Pincode').fill('400001');
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL('/new/photos');

    // Step 4: Photos
    // Skip photos for now
    await page.click('button:has-text("Skip & Next")');
    await expect(page).toHaveURL('/new/review');

    // Step 5: Review
    // Verify details are present
    await expect(page.getByText('1000 sq ft')).toBeVisible();
    await expect(page.getByText('123 Main St')).toBeVisible();

    // Handle alert
    page.on('dialog', (dialog) => dialog.accept());

    // Submit
    await page.click('button:has-text("Submit Valuation")');

    // Expect to return to dashboard
    await expect(page).toHaveURL('/');

    // Verify new property is in the list
    await expect(page.getByText('123 Main St')).toBeVisible();
  });
});
