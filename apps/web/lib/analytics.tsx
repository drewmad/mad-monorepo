'use client';
import Script from 'next/script';

/**
 * Lightweight integration for Vercel Analytics.
 * Loads the Vercel analytics script on the client.
 */
export function Analytics() {
  return (
    <Script
      src="https://vercel.live/analytics/script.js"
      strategy="afterInteractive"
    />
  );
}
