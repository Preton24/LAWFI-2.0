// This file sets up the PostHog client for use throughout the application.
// For Next.js, it's common to initialize PostHog in a client component or a provider.

import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  // Only initialize PostHog in the browser
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Add additional configuration options here if needed, e.g.:
    // loaded: (posthog) => {
    //   if (process.env.NODE_ENV === 'development') posthog.debug();
    // }
  });
}

// Export the initialized PostHog client
export default posthog;