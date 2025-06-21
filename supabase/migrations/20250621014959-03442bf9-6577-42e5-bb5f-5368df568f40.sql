
-- Create a storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

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
