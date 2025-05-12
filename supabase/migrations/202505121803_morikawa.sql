-- ストレージバケットに対するポリシーを追加
-- これはすべての認証済みユーザーに対してすべての操作を許可します

-- INSERTポリシー
CREATE POLICY "Allow any authenticated user to INSERT"
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'loan-documents');

-- SELECTポリシー
CREATE POLICY "Allow any authenticated user to SELECT"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'loan-documents');

-- UPDATEポリシー
CREATE POLICY "Allow any authenticated user to UPDATE"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'loan-documents')
WITH CHECK (bucket_id = 'loan-documents');

-- DELETEポリシー
CREATE POLICY "Allow any authenticated user to DELETE"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'loan-documents');