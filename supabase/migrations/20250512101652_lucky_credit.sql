-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Allow all operations on loan documents" ON storage.objects;

-- Create a single policy that allows all operations for all users
CREATE POLICY "Allow all operations on loan applications"
ON loan_applications FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Storage bucket policies for loan-documents
CREATE POLICY "Allow all operations on loan documents"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'loan-documents')
WITH CHECK (bucket_id = 'loan-documents');

-- Helper function to create folder path for loan documents
CREATE OR REPLACE FUNCTION get_loan_document_path(loan_id text, file_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN loan_id || '/' || file_name;
END;
$$;