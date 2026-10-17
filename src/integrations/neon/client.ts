import { createClient } from '@neondatabase/neon-js';
import { createAuthClient } from '@neondatabase/auth';
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

if (!authUrl || !dataApiUrl) {
  // Fail soft so the UI still renders; auth and data calls will surface
  // their own errors instead of crashing the whole page at import time.
  console.warn(
    'Missing Neon environment variables (VITE_NEON_AUTH_URL, VITE_NEON_DATA_API_URL). Sign-in and saved data will not work until they are set.'
  );
}

export const authClient = createAuthClient(authUrl ?? 'http://localhost', {
  adapter: BetterAuthReactAdapter(),
});

export const client = createClient({
  dataApi: {
    url: dataApiUrl ?? 'http://localhost',
    getToken: async () => {
      try {
        return (await authClient.token()).data?.token ?? null;
      } catch {
        return null;
      }
    },
  },
});
