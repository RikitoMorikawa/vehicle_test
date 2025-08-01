/*
  # Set up vehicle image storage

  1. Changes
    - Create a new storage bucket for vehicle images
    - Update vehicles table to use storage URLs
    - Add RLS policies for storage bucket

  2. Security
    - Enable RLS on storage bucket
    - Add policies for authenticated users to read images
    - Add policies for admins to manage images
*/

-- Create a new storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to read vehicle images
CREATE POLICY "Public can view vehicle images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehicle-images');

-- Allow authenticated users to upload vehicle images
CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow admins to delete vehicle images
CREATE POLICY "Admins can delete vehicle images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vehicle-images'
  AND (
    SELECT role = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  )
);

-- Update vehicles table to use storage URLs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vehicles' AND column_name = 'image_path'
  ) THEN
    ALTER TABLE vehicles ADD COLUMN image_path text;
  END IF;
END $$;