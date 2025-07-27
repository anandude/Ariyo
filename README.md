# Ariyo - Remember Everyone

A beautiful app to remember names and personal details of the people in your life.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Copy `.env.example` to `.env.local`
4. Update the environment variables in `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Database Setup

Choose one of the following options:

**Option A: Using Supabase CLI (Recommended for developers)**
```bash
npx supabase login
npx supabase link --project-ref your-project-id
npx supabase db push
```

**Option B: Manual Setup (Easier for beginners)**
1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `setup_database.sql`
4. Run the SQL

5. Run the development server: `npm run dev` or `pnpm dev`

## Environment Variables

Create a `.env.local` file with the following variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

Please ensure you don't commit sensitive information like API keys or personal data.