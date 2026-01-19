-- ============================================
-- Storage 버킷 정책 설정
-- ============================================
-- 이 스크립트는 Supabase SQL Editor에서 실행하거나
-- Storage 대시보드의 Policies 탭에서 수동으로 설정할 수 있습니다.

-- ============================================
-- 정책 1: 업로드 정책
-- 사용자는 자신의 폴더({user_id}/)에만 업로드 가능
-- ============================================
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'::text
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 정책 2: 읽기 정책 (Public)
-- 모든 사용자가 읽기 가능 (Public bucket이므로)
-- ============================================
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'product-images'::text
);

-- ============================================
-- 정책 3: 삭제 정책
-- 사용자는 자신의 파일만 삭제 가능
-- ============================================
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'::text
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 정책 4: 업데이트 정책 (선택사항)
-- 사용자는 자신의 파일만 업데이트 가능
-- ============================================
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images'::text
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'product-images'::text
  AND (storage.foldername(name))[1] = auth.uid()::text
);
