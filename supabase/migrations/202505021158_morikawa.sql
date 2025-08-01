-- すべての操作に対するポリシー
CREATE POLICY "favoritesテーブルのアクセス制御" ON "public"."favorites"
FOR ALL USING (true)
WITH CHECK (true);