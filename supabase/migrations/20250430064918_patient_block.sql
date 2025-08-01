/*
  # Update vehicle image paths

  1. Changes
    - Update image_path for existing vehicles to use Supabase storage paths
*/

UPDATE vehicles
SET image_path = CASE
  WHEN id = (SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 1) THEN 'pexels-photo-116675.jpeg'
  WHEN id = (SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 1 OFFSET 1) THEN 'pexels-photo-170811.jpeg'
  WHEN id = (SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 1 OFFSET 2) THEN 'pexels-photo-210019.jpeg'
  WHEN id = (SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 1 OFFSET 3) THEN 'pexels-photo-248687.jpeg'
  WHEN id = (SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 1 OFFSET 4) THEN 'pexels-photo-1638459.jpeg'
  WHEN id = (SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 1 OFFSET 5) THEN 'pexels-photo-3729464.jpeg'
END
WHERE id IN (
  SELECT id FROM vehicles ORDER BY created_at ASC LIMIT 6
);