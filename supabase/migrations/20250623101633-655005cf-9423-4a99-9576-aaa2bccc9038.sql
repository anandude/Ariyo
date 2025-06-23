
-- Add image_position column to the people table
ALTER TABLE public.people 
ADD COLUMN image_position jsonb DEFAULT NULL;
