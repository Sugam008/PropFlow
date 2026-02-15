import { test, expect } from '@playwright/test';

test.describe('Performance Hardening', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/*', async route => {
      const url = route.request().url();
      if (url.includes('/api/v1/')) {
        if (url.includes('/properties/') || url.includes('/properties?')) {
          if (url.endsWith('/photos')) {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify([
                { id: 'photo-1', photo_type: 'EXTERIOR', s3_url: 'https://placehold.co/600x400?text=Exterior' },
                { id: 'photo-2', photo_type: 'INTERIOR', s3_url: 'https://placehold.co/600x400?text=Interior' }
              ])
            });
          } else if (url.match(/\/properties\/[^\/]+$/)) {
            // Individual property
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                id: 'prop-1',
                address: '123 Tech Park',
                city: 'Bangalore',
                state: 'KA',
                pincode: '560001',
                status: 'VALUED',
                property_type: 'Commercial',
                estimated_value: 15000000,
                created_at: new Date().toISOString(),
                user_id: 'user-1',
                lat: 12.9716,
                lng: 77.5946
              })
            });
          } else {
            // List
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify([
                {
                  id: 'prop-1',
                  address: '123 Tech Park',
                  city: 'Bangalore',
                  state: 'KA',
                  pincode: '560001',
                  status: 'VALUED',
                  property_type: 'Commercial',
                  estimated_value: 15000000,
                  created_at: new Date().toISOString()
                },
                {
                  id: 'prop-2',
                  address: '456 Garden City',
                  city: 'Bangalore',
                  state: 'KA',
                  pincode: '560002',
                  status: 'SUBMITTED',
                  property_type: 'Residential',
                  created_at: new Date().toISOString()
                }
              ])
            });
          }
        } else if (url.includes('/comps/')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              { id: 'comp-1', address: '789 Business Hub', property_type: 'Commercial', area_sqft: 2000, price: 14000000, distance_km: 0.5, lat: 12.9716, lng: 77.5946 },
              { id: 'comp-2', address: '321 Office Square', property_type: 'Commercial', area_sqft: 2500, price: 16000000, distance_km: 1.2, lat: 12.9716, lng: 77.5946 }
            ])
          });
        } else if (url.includes('/valuations/')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([])
          });
        }
      } else {
        await route.continue();
      }
    });

    page.on('pageerror', error => {
      console.error('PAGE ERROR:', error.message);
    });
    page.on('console', msg => {
      if (msg.type() === 'error') console.error('CONSOLE ERROR:', msg.text());
    });
  });

  test('Home page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for the main content to be visible
    await page.waitForSelector('h1:has-text("Welcome back, Valuer")');
    
    // Wait for the data table to load (using React Query)
    await page.waitForSelector('table');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`Home page load time: ${loadTime}ms`);
    
    // Performance target: < 2000ms for initial load and data fetch on local
    expect(loadTime).toBeLessThan(2000);
  });

  test('Property Detail page load performance', async ({ page }) => {
    // First go to home to get a property ID
    await page.goto('/');
    await page.waitForSelector('table');
    
    // Click on the first row to navigate to details
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.click();
    
    const startTime = Date.now();
    // Wait for the detail header
    await page.waitForSelector('h1');
    
    // Wait for photos card
    await page.waitForSelector('text=Property Photos');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`Property Detail page navigation time: ${loadTime}ms`);
    
    // Navigation should be fast as it's a client-side transition
    expect(loadTime).toBeLessThan(1500);
  });

  test('Analytics page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/analytics');
    
    // Wait for the main header
    await page.waitForSelector('h1:has-text("Performance Analytics")');
    
    // Wait for stats cards
    await page.waitForSelector('text=Total Valuations');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`Analytics page load time: ${loadTime}ms`);
    
    // Performance target: < 1500ms
    expect(loadTime).toBeLessThan(1500);
  });
});
