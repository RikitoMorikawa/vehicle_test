-- Drop existing policies for processing_fees
DROP POLICY IF EXISTS "管理者は手続代行費用内訳の全操作が可能" ON processing_fees;
DROP POLICY IF EXISTS "認証済みユーザーは手続代行費用内訳を閲覧可" ON processing_fees;

-- Drop existing policies for legal_fees
DROP POLICY IF EXISTS "管理者は預り法定費用内訳の全操作が可能" ON legal_fees;
DROP POLICY IF EXISTS "認証済みユーザーは預り法定費用内訳を閲覧可" ON legal_fees;

-- Drop existing policies for tax_insurance_fees
DROP POLICY IF EXISTS "管理者は税金・保険料内訳の全操作が可能" ON tax_insurance_fees;
DROP POLICY IF EXISTS "認証済みユーザーは税金・保険料内訳を閲覧可" ON tax_insurance_fees;

-- Drop existing policies for accessories
DROP POLICY IF EXISTS "管理者は付属品・特別仕様の全操作が可能" ON accessories;
DROP POLICY IF EXISTS "認証済みユーザーは付属品・特別仕様を閲覧可" ON accessories;

-- Drop existing policies for loan_calculations
DROP POLICY IF EXISTS "管理者はローン計算情報の全操作が可能" ON loan_calculations;
DROP POLICY IF EXISTS "認証済みユーザーはローン計算情報を閲覧可能" ON loan_calculations;

-- Create new policies that allow all operations
CREATE POLICY "Allow all operations on processing_fees"
ON processing_fees FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on legal_fees"
ON legal_fees FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on tax_insurance_fees"
ON tax_insurance_fees FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on accessories"
ON accessories FOR ALL
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on loan_calculations"
ON loan_calculations FOR ALL
TO public
USING (true)
WITH CHECK (true);