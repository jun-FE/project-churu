# 다음 단계 가이드

## 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
VITE_SUPABASE_URL=https://ufikktucjbnlwyxephwg.supabase.co
VITE_SUPABASE_ANON_KEY=여기에_복사한_키_붙여넣기
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

**주의사항:**
- `.env.local` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)
- anon public 키 전체를 복사해서 붙여넣으세요
- 따옴표나 공백 없이 그대로 입력하세요

## 2. 개발 서버 실행

터미널에서 다음 명령어를 실행하세요:

```bash
yarn dev
```

## 3. 연결 확인

1. 브라우저가 자동으로 열립니다 (보통 http://localhost:5173)
2. 브라우저 개발자 도구 열기 (F12 또는 Cmd+Option+I)
3. Console 탭에서 에러가 없는지 확인
4. "Missing Supabase environment variables" 에러가 나오면 `.env.local` 파일을 확인하세요

## 4. 데이터베이스 스키마 확인

환경 변수가 제대로 설정되었다면, 다음 단계로 데이터베이스 스키마를 생성해야 합니다:

1. Supabase 대시보드 → SQL Editor
2. `supabase/schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣고 실행
4. Table Editor에서 `products`와 `product_links` 테이블 확인

## 문제 해결

### "Missing Supabase environment variables" 에러
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확히 `.env.local`인지 확인 (앞에 점 포함)
- 개발 서버를 재시작해보세요 (`yarn dev`)

### 연결이 안 될 때
- Supabase 프로젝트가 활성화되어 있는지 확인
- URL과 키가 정확히 복사되었는지 확인
- 브라우저 콘솔의 에러 메시지를 확인
