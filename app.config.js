import 'dotenv/config';

/**
 * Simple app.config.js that exposes env vars to the Expo manifest under `expo.extra`.
 * Add your Supabase keys to a local `.env` file (not committed) matching `.env.example`.
 */
export default {
  expo: {
    name: 'Medexa',
    slug: 'madproject',
    version: '1.0.0',
    platforms: ['ios', 'android', 'web'],
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
