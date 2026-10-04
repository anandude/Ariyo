# Ariyo: Supabase → Neon Port — Design Spec

Date: 2026-10-04

## Problem

Ariyo is a Vite + React + TypeScript SPA that remembers important people
(birthdays, categories, how you met, custom fields, plans, profile images).
It currently cannot run: its Supabase project
(`gdvfprzywxvoiptcuszu.supabase.co`) no longer resolves in DNS. Auth, data,
and image uploads are all dead at runtime. There is nothing to migrate — the
Supabase project is gone.

## Goals

- Replace Supabase with Neon primitives end-to-end, preserving all existing
  features and UI.
- No custom API server: browser talks to Neon Data API (PostgREST) directly,
  with access control enforced by Postgres RLS.
- Keep the app deployable to Vercel as today.
- Fix the lint errors found during the audit (9 errors: `any` types, a
  `require()` import in `tailwind.config.ts`).

Non-goals: new features, Supabase data import, production SMTP for auth
emails (shared `auth@mail.myneon.app` is fine for now).

## Target architecture

Keep the Vite SPA on Vercel. Neon provides auth, data, and storage:

| Concern   | Before                        | After                                                        |
| --------- | ----------------------------- | ------------------------------------------------------------ |
| Auth      | Supabase Auth (`AuthContext`) | Neon Auth — managed Better Auth, `createAuthClient()` from `@neondatabase/neon-js/auth` |
| Data      | `supabase.from('people')`     | Neon Data API (PostgREST) via `@neondatabase/neon-js` client |
| Storage   | `profile-images` public bucket | Neon Object Storage `profile-images` (`public_read`) + one Neon Function for signed uploads |

Neon project `wispy-flower-18622319`, branch `production`, region
`ap-southeast-1`. Already provisioned during setup:

- Neon Auth enabled (`NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL` pulled into
  `.env.local`).
- Data API enabled: `https://ep-snowy-rice-b3x7espt.apirest.c-4.ap-southeast-1.aws.neon.tech/neondb/rest/v1`.
- Bucket `profile-images` (`public_read`).
- `AWS_*` S3 env vars pulled into `.env.local`.

## Database schema (new `setup_database.sql`)

```sql
CREATE TABLE public.people (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL DEFAULT auth.user_id(),
  name        text NOT NULL,
  category    text NOT NULL,
  birthday    date,
  location    text,
  favorite_food text,
  how_we_met  text,
  image_url   text,
  image_position jsonb,
  custom_fields jsonb NOT NULL DEFAULT '{}',
  plans_made  jsonb NOT NULL DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

CREATE POLICY people_select ON public.people FOR SELECT
  TO authenticated USING (auth.user_id() = user_id);
CREATE POLICY people_insert ON public.people FOR INSERT
  TO authenticated WITH CHECK (auth.user_id() = user_id);
CREATE POLICY people_update ON public.people FOR UPDATE
  TO authenticated USING (auth.user_id() = user_id)
  WITH CHECK (auth.user_id() = user_id);
CREATE POLICY people_delete ON public.people FOR DELETE
  TO authenticated USING (auth.user_id() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.people TO authenticated;
```

Note: `user_id` changes from `uuid` (Supabase `auth.users.id`) to `text`
matching Neon Auth's Better Auth user id (`auth.user_id()`).

## Frontend changes

- Delete `src/integrations/supabase/` and `supabase/` directory.
- Add `src/integrations/neon/client.ts`:
  `createClient({ auth: ..., dataApiUrl: VITE_NEON_DATA_API_URL })` from
  `@neondatabase/neon-js`, single Neon URL. Delete the old generated
  `types.ts`; define a local `Person` row type matching the SQL schema.
- Rewrite `src/contexts/AuthContext.tsx` around
  `authClient` (`signIn.email`, `signIn.social({ provider: 'google' })`,
  `getSession`, `signOut`), keeping the same React context value shape
  (`user`, `session`, `signUp`, `signIn`, `signInWithGoogle`, `signOut`,
  `loading`) so pages don't churn.
- Rewrite `src/hooks/usePeople.ts` to call `client.from('people')...`
  (PostgREST builder: `select`, `insert`, `update`, `delete`, `eq`, `order`).
  Keep the `Person`/`Plan` types and JSON converters.
- Update image upload components (`ImageUpload.tsx`,
  `ImageUploadModal.tsx`, `ProfilePictureModal.tsx`) to call the upload
  endpoint, then store the resulting public object URL on the person.
- Remove `@supabase/supabase-js` from dependencies; add
  `@neondatabase/neon-js` (+ `@neondatabase/auth`), `files-sdk`,
  `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` for the function.

## Storage upload flow

`neon.ts` declares the `api` function:

```ts
functions: { api: { name: "api", source: "./api.ts" } },
buckets: { "profile-images": { access: "public_read" } },
auth: true,
```

`api.ts` (web-standard `fetch` handler, Node 24 runtime):

- `POST /upload` with a JWT (verified via `NEON_AUTH_JWKS_URL`) and a
  filename: returns a presigned PUT URL from the `profile-images` bucket
  scoped to `people/<user-id>/<uuid>.<ext>`.
- Browser PUTs the file to the presigned URL, then stores
  `${VITE_S3_PUBLIC_ENDPOINT}/profile-images/<key>` as `image_url`.

Public reads work because the bucket is `public_read`
(`${AWS_ENDPOINT_URL_S3}/profile-images/<key>`). No CDN in front for now;
keys are per-version so a CDN can be added later.

## Environment variables

`.env.example` and Vercel settings updated to:

- `VITE_NEON_AUTH_URL` — Neon Auth base URL
- `VITE_NEON_DATA_API_URL` — Data API URL
- `VITE_S3_PUBLIC_ENDPOINT` — branch S3 endpoint for public image URLs
- `DATABASE_URL` — only used locally for running the SQL migration

`VITE_SUPABASE_*` removed. `neon config init` already wrote `neon.ts` and
pulled branch vars into `.env.local`.

## Testing / verification

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
2. Run `setup_database.sql` against the production branch (`neon sql` or
   SQL editor) and confirm the Data API schema cache refreshes.
3. `npm run dev`: sign up a new user, create a person with all fields,
   upload a profile image, edit, delete — verify RLS isolates data by
   creating a second account.
4. `neon config plan` shows no drift; `neon deploy` deploys the `api`
   function and bucket config.

## Files touched

- Delete: `src/integrations/supabase/*`, `supabase/`,
  `setup_database.sql` (replaced), Supabase env vars.
- New: `src/integrations/neon/client.ts`, `api.ts`, new
  `setup_database.sql`, `docs/superpowers/specs/2026-10-04-neon-port-design.md`.
- Modify: `AuthContext.tsx`, `usePeople.ts`, image upload components,
  `src/pages/Auth.tsx` (only if the Better Auth UI adapter requires prop changes), `neon.ts`, `package.json`,
  `.env.example`, `README.md`, `tailwind.config.ts` (lint fix).
