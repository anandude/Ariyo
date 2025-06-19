
-- Create a table for people data with user association
CREATE TABLE public.people (
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

-- Add Row Level Security (RLS) to ensure users can only see their own people
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;

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
