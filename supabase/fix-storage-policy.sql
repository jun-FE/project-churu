-- ============================================
-- Storage 정책 완전히 열기 (개인용 앱)
-- ============================================

-- 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on product-images" ON storage.objects;
DROP POLICY IF EXISTS "Dev: Allow all storage operations" ON storage.objects;

-- 모든 사용자(인증 없이도)가 product-images 버킷에 모든 작업 가능
CREATE POLICY "Allow all operations on product-images"
  ON storage.objects FOR ALL
  TO public
  USING (bucket_id = 'product-images'::text)
  WITH CHECK (bucket_id = 'product-images'::text);

-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
