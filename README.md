# Ariyo - Remember Everyone

A beautiful app to remember names and personal details of the people in your life.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Neon (Auth, Data API, Object Storage, Functions)

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Link the repo to your Neon project (from the repo root):
   ```bash
   neon link
   ```
4. In the [Neon Console](https://console.neon.tech), enable the services this app needs:
   - **Auth** — note the Auth URL
   - **Data API** — note the Data API URL
5. Copy `.env.example` to `.env.local` and fill in the values:
   ```
   VITE_NEON_AUTH_URL=your_neon_auth_url_here
   VITE_NEON_DATA_API_URL=your_neon_data_api_url_here
   VITE_S3_PUBLIC_ENDPOINT=your_s3_public_endpoint_here
   VITE_NEON_FUNCTION_URL=your_neon_function_url_here
   DATABASE_URL=your_database_url_here
   ```
6. Run the development server: `npm run dev` or `pnpm dev`

### Database Setup

`setup_database.sql` creates the `people` table with Row Level Security (four
policies isolating rows per user) and is safe to re-run. Apply it, then refresh
the Data API schema cache:

**Option A: Using the Neon CLI**

```bash
neon psql production --project-id wispy-flower-18622319 --role-name neondb_owner \
  -- -v ON_ERROR_STOP=1 -f setup_database.sql
neon data-api refresh-schema --project-id wispy-flower-18622319 --branch production
```

**Option B: Manual Setup (Easier for beginners)**

1. Go to your Neon project dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `setup_database.sql`
4. Run the SQL
5. Refresh the Data API schema (Neon Console → Data API, or the
   `neon data-api refresh-schema` command above)

### Deploying the Upload Function

`neon.ts` declares the app's Neon services: Auth, Data API, the public-read
`profile-images` bucket, and the `api` function (`api.ts`), which mints
presigned upload URLs. Deploy them with:

```bash
neon deploy
```

The printed function URL is the value for `VITE_NEON_FUNCTION_URL`.

## Environment Variables

Create a `.env.local` file with the following variables:

- `VITE_NEON_AUTH_URL`: Your Neon Auth base URL (Neon Console → Auth)
- `VITE_NEON_DATA_API_URL`: Your Neon Data API URL (Neon Console → Data API)
- `VITE_S3_PUBLIC_ENDPOINT`: The S3 endpoint used to build public image URLs
- `VITE_NEON_FUNCTION_URL`: The deployed upload function's URL (from `neon deploy`)
- `DATABASE_URL`: Your Postgres connection string — only used locally for running migrations

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please ensure you don't commit sensitive information like API keys or personal data.
