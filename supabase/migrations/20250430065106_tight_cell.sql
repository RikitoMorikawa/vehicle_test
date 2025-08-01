/*
  # Remove image_url column from vehicles table
  
  1. Changes
    - Remove image_url column from vehicles table as it's no longer needed
    - All images are now served from Supabase storage using image_path
*/

ALTER TABLE vehicles DROP COLUMN IF EXISTS image_url;