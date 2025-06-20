
-- Add plans made field to the people table
ALTER TABLE public.people 
ADD COLUMN plans_made jsonb DEFAULT '[]'::jsonb;

-- Update the table comment to reflect the new field
COMMENT ON COLUMN public.people.plans_made IS 'Array of plans made with this person, each containing description and date';
