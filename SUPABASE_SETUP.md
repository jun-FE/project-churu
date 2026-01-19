# Supabase 설정 빠른 가이드

## 단계별 설정

### 1단계: Supabase 프로젝트 생성
1. https://supabase.com 접속 및 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력 후 생성

### 2단계: 데이터베이스 스키마 생성
1. Supabase 대시보드 → **SQL Editor** 클릭
2. `supabase/schema.sql` 파일 내용 복사하여 실행
3. 성공 확인

### 3단계: Storage 버킷 생성
1. **Storage** 메뉴 클릭
2. "Create a new bucket" 클릭
3. 설정:
   - Name: `product-images`
   - Public bucket: ✅ 체크
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg,image/png,image/webp`
4. 생성 완료

### 4단계: Storage 정책 설정
1. `product-images` 버킷 클릭 → **Policies** 탭
2. `supabase/storage-policies.sql` 파일의 정책들을 추가
   - 또는 SQL Editor에서 실행

### 5단계: 환경 변수 설정
1. 프로젝트 루트에 `.env.local` 파일 생성
2. Supabase 대시보드 → **Settings** → **API**에서 값 복사
3. `.env.local`에 다음 내용 추가:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

### 6단계: 확인
```bash
yarn dev
```

브라우저 콘솔에서 에러가 없는지 확인하세요.

## 상세 가이드
더 자세한 내용은 `supabase/README.md`를 참고하세요.
