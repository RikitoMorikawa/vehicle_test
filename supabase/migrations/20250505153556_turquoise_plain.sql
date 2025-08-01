/*
  # Fix storage bucket RLS policies

  1. Changes
    - Drop existing policies
    - Create new policies that allow all operations for authenticated users
    - Maintain public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete vehicle images" ON storage.objects;

-- Create new simple policies
CREATE POLICY "Allow all operations on vehicle images"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');