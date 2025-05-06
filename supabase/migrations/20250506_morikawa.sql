-- Supabaseの場合、SQL Editorで実行
ALTER TABLE vehicles 
ADD COLUMN view360_images TEXT[] DEFAULT '{}'::TEXT[];


-- Supabaseのダッシュボードで実行（SQL Editor）
-- ストレージバケットへの一般的なアクセスポリシーを設定

-- vehicle-360バケットの閲覧ポリシー（誰でも閲覧可能）
CREATE POLICY "Allow public read access for vehicle-360" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vehicle-360');

-- vehicle-360バケットの挿入ポリシー（誰でも挿入可能）
CREATE POLICY "Allow public insert access for vehicle-360" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vehicle-360');

-- vehicle-360バケットの更新ポリシー（誰でも更新可能）
CREATE POLICY "Allow public update access for vehicle-360" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vehicle-360');

-- vehicle-360バケットの削除ポリシー（誰でも削除可能）
CREATE POLICY "Allow public delete access for vehicle-360" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vehicle-360');