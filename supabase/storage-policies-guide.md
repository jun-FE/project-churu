# Storage 정책 추가 가이드

## UI에서 정책 추가하기

### 정책 1: 업로드 정책 (INSERT)

1. "PRODUCT-IMAGES" 버킷의 "New policy" 버튼 클릭
2. 설정:
   - **Policy name**: `Users can upload to own folder`
   - **Allowed operation**: `INSERT` 선택
   - **Policy definition** (WITH CHECK):
   ```sql
   bucket_id = 'product-images'::text
   AND (storage.foldername(name))[1] = auth.uid()::text
   ```
   - **Target roles**: `authenticated` 선택
3. "Review" → "Save policy" 클릭

### 정책 2: 읽기 정책 (SELECT) - Public

1. "New policy" 버튼 클릭
2. 설정:
   - **Policy name**: `Public read access`
   - **Allowed operation**: `SELECT` 선택
   - **Policy definition** (USING):
   ```sql
   bucket_id = 'product-images'::text
   ```
   - **Target roles**: `public` 선택
3. "Review" → "Save policy" 클릭

### 정책 3: 삭제 정책 (DELETE)

1. "New policy" 버튼 클릭
2. 설정:
   - **Policy name**: `Users can delete own files`
   - **Allowed operation**: `DELETE` 선택
   - **Policy definition** (USING):
   ```sql
   bucket_id = 'product-images'::text
   AND (storage.foldername(name))[1] = auth.uid()::text
   ```
   - **Target roles**: `authenticated` 선택
3. "Review" → "Save policy" 클릭

### 정책 4: 업데이트 정책 (UPDATE) - 선택사항

1. "New policy" 버튼 클릭
2. 설정:
   - **Policy name**: `Users can update own files`
   - **Allowed operation**: `UPDATE` 선택
   - **Policy definition**:
     - **USING**:
     ```sql
     bucket_id = 'product-images'::text
     AND (storage.foldername(name))[1] = auth.uid()::text
     ```
     - **WITH CHECK**:
     ```sql
     bucket_id = 'product-images'::text
     AND (storage.foldername(name))[1] = auth.uid()::text
     ```
   - **Target roles**: `authenticated` 선택
3. "Review" → "Save policy" 클릭

## SQL Editor에서 일괄 추가하기

1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. "New query" 클릭
3. `supabase/storage-policies.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭
5. 성공 메시지 확인

## 정책 확인

정책 추가 후 "Policies" 탭에서 다음 4개의 정책이 보이는지 확인하세요:
- ✅ Users can upload to own folder (INSERT)
- ✅ Public read access (SELECT)
- ✅ Users can delete own files (DELETE)
- ✅ Users can update own files (UPDATE) - 선택사항
