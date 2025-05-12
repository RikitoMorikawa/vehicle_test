-- -- ストレージバケットに対するポリシーを追加
-- -- これはすべての認証済みユーザーに対してすべての操作を許可します

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Users can read their own loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Users can update their own loan applications" ON loan_applications;
DROP POLICY IF EXISTS "Users can delete their own loan applications" ON loan_applications;

-- Create a single policy that allows all operations for all users
CREATE POLICY "Allow all operations on loan applications"
ON loan_applications FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Storage bucket policies
DROP POLICY IF EXISTS "Authenticated users can upload loan documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own loan documents" ON storage.objects;

-- Create open access storage policies
CREATE POLICY "Allow all operations on loan documents"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'loan-documents')
WITH CHECK (bucket_id = 'loan-documents');