-- Complete database setup for Ariyo
-- Run this SQL in your Supabase SQL Editor to set up all required tables and policies

-- Create a table for people data with user association
CREATE TABLE IF NOT EXISTS public.people (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  birthday DATE,
  location TEXT,
  favorite_food TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add plans made field to the people table
ALTER TABLE public.people 
ADD COLUMN IF NOT EXISTS plans_made JSONB DEFAULT '[]'::jsonb;

-- Add the how_we_met column to the people table
ALTER TABLE public.people 
ADD COLUMN IF NOT EXISTS how_we_met TEXT;

-- Add image_url column to the people table
ALTER TABLE public.people 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_position column to the people table
ALTER TABLE public.people 
ADD COLUMN IF NOT EXISTS image_position JSONB DEFAULT NULL;

-- Add Row Level Security (RLS) to ensure users can only see their own people
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own people" ON public.people;
DROP POLICY IF EXISTS "Users can create their own people" ON public.people;
DROP POLICY IF EXISTS "Users can update their own people" ON public.people;
DROP POLICY IF EXISTS "Users can delete their own people" ON public.people;

-- Create policy that allows users to SELECT their own people
CREATE POLICY "Users can view their own people" 
  ON public.people 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own people
CREATE POLICY "Users can create their own people" 
  ON public.people 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own people
CREATE POLICY "Users can update their own people" 
  ON public.people 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own people
CREATE POLICY "Users can delete their own people" 
  ON public.people 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a storage bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete profile images" ON storage.objects;

-- Create a policy to allow authenticated users to upload their own images
CREATE POLICY "Users can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.role() = 'authenticated'
);

-- Create a policy to allow everyone to view profile images (since they're public)
CREATE POLICY "Anyone can view profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');

-- Create a policy to allow users to update their uploaded images
CREATE POLICY "Users can update profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' AND 
  auth.role() = 'authenticated'
);

-- Create a policy to allow users to delete their uploaded images
CREATE POLICY "Users can delete profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' AND 
  auth.role() = 'authenticated'
);

-- Add comments to document the schema
COMMENT ON COLUMN public.people.plans_made IS 'Array of plans made with this person, each containing description and date';
COMMENT ON COLUMN public.people.how_we_met IS 'How the user met this person';
COMMENT ON COLUMN public.people.image_position IS 'JSON object containing position/crop information for the profile image';
