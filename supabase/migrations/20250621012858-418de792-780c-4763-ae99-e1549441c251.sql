
-- Add the how_we_met column to the people table
ALTER TABLE public.people 
ADD COLUMN how_we_met text;

-- Update the table comment to reflect the new field
COMMENT ON COLUMN public.people.how_we_met IS 'How the user met this person';
