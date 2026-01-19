# Supabase 설정 가이드

이 문서는 Catalog 프로젝트의 Supabase 설정 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. 프로젝트 정보를 입력합니다:
   - **Name**: catalog (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (나중에 필요할 수 있으니 기록해두세요)
   - **Region**: 가장 가까운 리전 선택 (예: Northeast Asia (Seoul))
4. "Create new project" 버튼을 클릭합니다.
5. 프로젝트 생성이 완료될 때까지 대기합니다 (약 2분 소요).

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 왼쪽 메뉴의 **SQL Editor**를 클릭합니다.
2. "New query" 버튼을 클릭합니다.
3. `supabase/schema.sql` 파일의 내용을 복사하여 SQL Editor에 붙여넣습니다.
4. "Run" 버튼을 클릭하여 실행합니다.
5. 성공 메시지가 표시되면 완료입니다.

### 스키마 확인

왼쪽 메뉴의 **Table Editor**를 클릭하여 다음 테이블이 생성되었는지 확인합니다:
- `products`
- `product_links`

## 3. Storage 버킷 생성

1. 왼쪽 메뉴의 **Storage**를 클릭합니다.
2. "Create a new bucket" 버튼을 클릭합니다.
3. 버킷 정보를 입력합니다:
   - **Name**: `product-images`
   - **Public bucket**: ✅ 체크 (이미지 다운로드를 위해 공개 필요)
   - **File size limit**: 5MB (또는 원하는 크기)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
4. "Create bucket" 버튼을 클릭합니다.

## 4. Storage 정책 설정

1. 생성한 `product-images` 버킷을 클릭합니다.
2. "Policies" 탭을 클릭합니다.
3. "New Policy" 버튼을 클릭합니다.

### 정책 1: 업로드 정책 (사용자는 자신의 폴더에만 업로드 가능)

```sql
-- Policy Name: Users can upload to own folder
-- Allowed operation: INSERT

(
  bucket_id = 'product-images'::text
  AND (storage.foldername(name))[1] = auth.uid()::text
)
```

### 정책 2: 읽기 정책 (모든 사용자가 읽기 가능 - Public bucket)

```sql
-- Policy Name: Public read access
-- Allowed operation: SELECT

true
```

### 정책 3: 삭제 정책 (사용자는 자신의 파일만 삭제 가능)

```sql
-- Policy Name: Users can delete own files
-- Allowed operation: DELETE

(
  bucket_id = 'product-images'::text
  AND (storage.foldername(name))[1] = auth.uid()::text
)
```

## 5. 환경 변수 설정

1. 프로젝트 루트에 `.env.local` 파일을 생성합니다.
2. Supabase 대시보드에서 다음 정보를 가져옵니다:
   - 왼쪽 메뉴의 **Settings** → **API** 클릭
   - **Project URL** 복사
   - **anon/public** 키 복사
3. `.env.local` 파일에 다음 내용을 추가합니다:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

**주의**: `.env.local` 파일은 Git에 커밋하지 마세요. (이미 `.gitignore`에 포함되어 있습니다)

## 6. 인증 설정 (선택사항)

현재 프로젝트는 인증이 필요하지만, 개발 단계에서는 다음 방법 중 하나를 사용할 수 있습니다:

### 방법 1: Email 인증 사용
1. **Authentication** → **Providers**에서 Email을 활성화합니다.
2. 앱에서 이메일/비밀번호로 로그인합니다.

### 방법 2: 개발용 임시 인증 비활성화 (개발 중에만)
RLS 정책을 임시로 비활성화하거나, 개발용 서비스 역할 키를 사용할 수 있습니다.
**주의**: 프로덕션에서는 절대 사용하지 마세요!

## 7. 설정 확인

다음 명령어로 개발 서버를 실행하여 연결을 확인합니다:

```bash
yarn dev
```

브라우저 콘솔에서 에러가 없는지 확인합니다.

## 문제 해결

### RLS 정책 오류
- 인증된 사용자로 로그인했는지 확인합니다.
- RLS 정책이 올바르게 생성되었는지 확인합니다.

### Storage 업로드 오류
- 버킷이 Public으로 설정되어 있는지 확인합니다.
- Storage 정책이 올바르게 설정되었는지 확인합니다.
- 파일 경로가 `{user_id}/{product_id}/filename` 형식인지 확인합니다.

### CORS 오류
- Supabase Storage는 기본적으로 CORS가 설정되어 있습니다.
- 문제가 발생하면 Supabase 대시보드의 Storage 설정을 확인합니다.

## 참고 자료

- [Supabase 문서](https://supabase.com/docs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage 가이드](https://supabase.com/docs/guides/storage)
