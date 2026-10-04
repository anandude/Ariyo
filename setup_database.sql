-- Ariyo database setup for Neon (replaces the Supabase version).
-- Run against the production branch, e.g.:
--   neon psql production --project-id wispy-flower-18622319 --role-name neondb_owner \
--     -- -v ON_ERROR_STOP=1 -f setup_database.sql
-- Then refresh the Data API schema cache:
--   neon data-api refresh-schema --project-id wispy-flower-18622319 --branch production

-- gen_random_uuid() lives in pgcrypto, which is not installed by default
-- on a fresh Neon project.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.people (
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

DROP POLICY IF EXISTS people_select ON public.people;
DROP POLICY IF EXISTS people_insert ON public.people;
DROP POLICY IF EXISTS people_update ON public.people;
DROP POLICY IF EXISTS people_delete ON public.people;

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
