import { useEffect, useCallback } from 'react';

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  ttfb?: number; // Time to First Byte
}

export function usePerformanceMonitoring() {
  const logMetric = useCallback((name: string, value: number) => {
    // Log to console in development
    if (__DEV__) {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }

    // In production, send to analytics service
    // analytics.track('performance_metric', { name, value });
  }, []);

  useEffect(() => {
    // Web Vitals for React Native Web / Next.js
    if (typeof window !== 'undefined' && 'performance' in window) {
      // FCP
      const observerFCP = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            logMetric('FCP', entry.startTime);
          }
        }
      });
      observerFCP.observe({ entryTypes: ['paint'] });

      // LCP
      const observerLCP = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logMetric('LCP', lastEntry.startTime);
      });
      observerLCP.observe({ entryTypes: ['largest-contentful-paint'] });

      // CLS
      let clsValue = 0;
      const observerCLS = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        logMetric('CLS', clsValue);
      });
      observerCLS.observe({ entryTypes: ['layout-shift'] });

      // FID
      const observerFID = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          logMetric('FID', fid);
        }
      });
      observerFID.observe({ entryTypes: ['first-input'] });

      return () => {
        observerFCP.disconnect();
        observerLCP.disconnect();
        observerCLS.disconnect();
        observerFID.disconnect();
      };
    }
  }, [logMetric]);

  return { logMetric };
}

// Performance budget checks
export function checkPerformanceBudget(metrics: PerformanceMetrics): {
  passed: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  if (metrics.fcp && metrics.fcp > 1500) {
    violations.push(`FCP ${metrics.fcp.toFixed(0)}ms exceeds budget 1500ms`);
  }

  if (metrics.lcp && metrics.lcp > 2500) {
    violations.push(`LCP ${metrics.lcp.toFixed(0)}ms exceeds budget 2500ms`);
  }

  if (metrics.cls && metrics.cls > 0.1) {
    violations.push(`CLS ${metrics.cls.toFixed(3)} exceeds budget 0.1`);
  }

  if (metrics.fid && metrics.fid > 100) {
    violations.push(`FID ${metrics.fid.toFixed(0)}ms exceeds budget 100ms`);
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

// API performance monitoring
export function measureApiCall<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();

  return fn().finally(() => {
    const duration = performance.now() - start;

    if (__DEV__) {
      console.log(`[API Performance] ${operation}: ${duration.toFixed(2)}ms`);
    }

    // Alert if p95 threshold exceeded
    if (duration > 500) {
      console.warn(
        `[API Performance] ${operation} exceeded p95 threshold: ${duration.toFixed(2)}ms`,
      );
    }
  });
}

// Bundle size monitoring
export function checkBundleSize(bytes: number, threshold: number = 25 * 1024 * 1024): boolean {
  const mb = bytes / (1024 * 1024);
  const thresholdMb = threshold / (1024 * 1024);

  if (bytes > threshold) {
    console.warn(`[Bundle Size] ${mb.toFixed(2)}MB exceeds threshold ${thresholdMb.toFixed(0)}MB`);
    return false;
  }

  console.log(`[Bundle Size] ${mb.toFixed(2)}MB within threshold`);
  return true;
}

export default {
  usePerformanceMonitoring,
  checkPerformanceBudget,
  measureApiCall,
  checkBundleSize,
};
