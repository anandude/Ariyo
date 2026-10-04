import { createClient } from '@neondatabase/neon-js';
import { createAuthClient } from '@neondatabase/auth';
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;
if (!authUrl || !dataApiUrl) {
  throw new Error('Missing Neon environment variables. Check your .env.local');
}

export const authClient = createAuthClient(authUrl, {
  adapter: BetterAuthReactAdapter(),
});

export const client = createClient({
  dataApi: {
    url: dataApiUrl,
    getToken: async () => (await authClient.token()).data?.token ?? null,
  },
});
