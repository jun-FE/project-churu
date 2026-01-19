# 이미지 업로드 문제 해결 가이드

## 문제: 이미지 업로드가 안 될 때

개인용 앱이므로 인증 없이도 이미지를 업로드할 수 있도록 Storage 정책을 설정해야 합니다.

## 해결 방법

### 1단계: Supabase SQL Editor에서 실행

다음 SQL을 **Supabase SQL Editor**에서 실행하세요:

```sql
-- 기존 Storage 정책 모두 삭제
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on product-images" ON storage.objects;

-- 모든 사용자(인증 없이도)가 product-images 버킷에 모든 작업 가능
CREATE POLICY "Allow all operations on product-images"
  ON storage.objects FOR ALL
  TO public
  USING (bucket_id = 'product-images'::text)
  WITH CHECK (bucket_id = 'product-images'::text);
```

### 2단계: 버킷이 Public인지 확인

1. **Storage** → **product-images** 버킷 클릭
2. **Settings** 탭 확인
3. **Public bucket**이 체크되어 있는지 확인
4. 체크되어 있지 않다면 체크하고 저장

### 3단계: 정책 확인

1. **Storage** → **product-images** 버킷 클릭
2. **Policies** 탭 확인
3. "Allow all operations on product-images" 정책이 있는지 확인

### 4단계: 테스트

브라우저를 새로고침하고 이미지 업로드를 다시 시도하세요.

## 여전히 안 될 때

브라우저 콘솔(F12)에서 에러 메시지를 확인하고 알려주세요.
