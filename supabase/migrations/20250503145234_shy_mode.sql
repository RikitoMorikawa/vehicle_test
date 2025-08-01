-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can delete vehicles" ON vehicles;

-- Create a single policy that allows all operations
CREATE POLICY "Allow all operations"
ON vehicles
FOR ALL
TO public
USING (true)
WITH CHECK (true);