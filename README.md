# Catalog - 제품 관리 앱

중국 사입 소싱 제품을 관리하는 모바일 웹 앱입니다.

## 기술 스택

- **Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS
- **UI Component:** shadcn/ui
- **State Management:** Zustand
- **Backend:** Supabase
- **Hosting:** Vercel

## 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

### 3. 개발 서버 실행

```bash
yarn dev
```

### 4. 빌드

```bash
yarn build
```

## 프로젝트 구조

```
src/
  components/     # 재사용 가능한 컴포넌트
  pages/          # 페이지 컴포넌트
  lib/            # Supabase 및 API 함수
  stores/         # Zustand 스토어
  utils/          # 유틸리티 함수
```

## 주요 기능

- 상품 CRUD 관리
- 이미지 업로드/다운로드
- 가격 및 마진 계산기
- 배송대행지 포맷 복사
- 상태 관리 및 필터링
- 태그 시스템

## 배포

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 Import
3. 환경 변수 설정
4. Deploy

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md) 또는 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) 참고

## 참고 문서

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - 프로젝트 계획서
- [CHECKLIST.md](./CHECKLIST.md) - 진행 상황 체크리스트
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 빠른 배포 가이드
