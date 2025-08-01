
-- 全ユーザーに参照権限を付与
CREATE POLICY "全ユーザーがメーカー情報を参照できる" ON car_makers
  FOR SELECT USING (true);