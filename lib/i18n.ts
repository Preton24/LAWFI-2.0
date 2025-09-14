// For next-intl setup, you would first install it: `npm install next-intl`
// Then configure it in a `next.config.js` and set up message files.
// This file primarily defines runtime utilities.

import { createGetText } from 'next-intl/server'; // For server components/actions
import { getRequestConfig } from 'next-intl/server'; // For setting up internationalization

// This configuration is used for static messages in getStaticProps and getServerSideProps
// and dynamically in middleware.ts for locale detection.
// It determines which message file to load based on the current locale.
export const locales = ['en', 'es', 'fr'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));

// Example usage for fetching messages from server components/actions
export async function getI18nMessages(locale: string) {
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.error(`Could not load messages for locale ${locale}:`, error);
    // Fallback to English or empty messages
    const fallbackMessages = (await import(`../messages/en.json`)).default;
    return fallbackMessages;
  }
}

// Client-side usage would typically use `useTranslations` hook from `next-intl/client`
// This file focuses on server-side aspects and configuration.

// To enable this, you would need:
// 1. `next.config.js` to define `i18n` with `locales` and `defaultLocale`.
// 2. A `middleware.ts` to handle locale detection.
// 3. A `messages` directory (`messages/en.json`, `messages/es.json`, etc.)
// 4. A `(locale)` folder in `app` (e.g., `app/[locale]/page.tsx`) to wrap your routes.

/*
// Example `messages/en.json`:
{
  "Home": {
    "title": "Welcome to LAW-FI",
    "description": "Your legal financial management platform."
  },
  "Chat": {
    "title": "AI Legal Chat Assistant"
  }
}
*/