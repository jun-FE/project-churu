-- ============================================
-- 모든 정책 완전히 열기 (개인용 앱)
-- ============================================

-- ============================================
-- Products 테이블 정책
-- ============================================

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can insert own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Dev: Allow all operations" ON products;

-- 모든 사용자(public)가 모든 작업 가능
CREATE POLICY "Allow all operations on products"
  ON products FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Product Links 테이블 정책
-- ============================================

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can view own product links" ON product_links;
DROP POLICY IF EXISTS "Users can insert own product links" ON product_links;
DROP POLICY IF EXISTS "Users can update own product links" ON product_links;
DROP POLICY IF EXISTS "Users can delete own product links" ON product_links;
DROP POLICY IF EXISTS "Allow all operations on product_links" ON product_links;

-- 모든 사용자(public)가 모든 작업 가능
CREATE POLICY "Allow all operations on product_links"
  ON product_links FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Storage 정책
-- ============================================

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on product-images" ON storage.objects;
DROP POLICY IF EXISTS "Dev: Allow all storage operations" ON storage.objects;

-- 모든 사용자(public)가 product-images 버킷에 모든 작업 가능
CREATE POLICY "Allow all operations on product-images"
  ON storage.objects FOR ALL
  TO public
  USING (bucket_id = 'product-images'::text)
  WITH CHECK (bucket_id = 'product-images'::text);

-- ============================================
-- 정책 확인 쿼리
-- ============================================

-- Products 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';

-- Storage 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
