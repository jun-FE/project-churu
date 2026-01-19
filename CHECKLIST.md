# 프로젝트 체크리스트: Catalog (캣탈로그)

이 문서는 프로젝트 진행 상황을 추적하기 위한 체크리스트입니다. 각 항목을 완료하면 체크박스를 업데이트하세요.

## Phase 1: 기초 설정 및 인프라

### 1.1 프로젝트 초기화
- [x] Vite + React + TypeScript 프로젝트 생성
- [x] Git 저장소 초기화 및 .gitignore 설정
- [x] 기본 폴더 구조 생성 (`src/pages`, `src/components`, `src/lib`, `src/utils`, `src/stores`)

### 1.2 Tailwind CSS 설정
- [x] Tailwind CSS 설치 및 설정
- [x] `tailwind.config.js` 설정 (반응형 브레이크포인트, 색상 팔레트)
- [x] `postcss.config.js` 설정
- [x] 기본 스타일 리셋 및 커스텀 유틸리티 클래스 정의

### 1.3 shadcn/ui 설정
- [x] shadcn/ui 초기화 (`components.json` 생성)
- [x] 필수 컴포넌트 설치:
  - [x] Button
  - [x] Card
  - [x] Input
  - [x] Select
  - [x] Dialog
  - [ ] Sheet (추후 필요시 추가)
  - [x] Toast
  - [x] Badge
  - [ ] Avatar (추후 필요시 추가)

### 1.4 Lucide React Icons
- [x] Lucide React 설치
- [x] 필요한 아이콘 import 테스트

### 1.5 Zustand 설정
- [x] Zustand 설치
- [x] 기본 스토어 구조 생성 (`productStore.ts`, `uiStore.ts`)
- [x] 타입 정의 파일 생성

### 1.6 Supabase 설정
- [ ] Supabase 프로젝트 생성 (사용자가 직접 생성 필요)
- [ ] 환경 변수 설정 (`.env.local`) - `SUPABASE_SETUP.md` 참고
- [x] Supabase 클라이언트 설정 (`src/lib/supabase.ts`)
- [ ] 데이터베이스 스키마 생성 (`supabase/schema.sql` 실행):
  - [ ] `products` 테이블 생성
  - [ ] `product_links` 테이블 생성
  - [ ] 인덱스 생성
  - [ ] RLS 정책 설정
- [ ] Storage 버킷 생성 (`product-images`) - `SUPABASE_SETUP.md` 참고
- [ ] Storage 정책 설정 (`supabase/storage-policies.sql` 실행)

### 1.7 라우팅 설정
- [x] React Router 설치 및 설정
- [x] 기본 라우트 구조 정의

---

## Phase 2: 핵심 CRUD 기능

### 2.1 API 레이어 구현
- [x] `src/lib/api/products.ts` 구현:
  - [x] `getProducts()` - 상품 리스트 조회
  - [x] `getProduct(id)` - 상품 상세 조회
  - [x] `createProduct(data)` - 상품 생성
  - [x] `updateProduct(id, data)` - 상품 수정
  - [x] `deleteProduct(id)` - 상품 삭제
- [x] `src/lib/api/productLinks.ts` 구현:
  - [x] `getProductLinks(productId)` - 링크 리스트 조회
  - [x] `createProductLink(data)` - 링크 생성
  - [x] `deleteProductLink(id)` - 링크 삭제
- [x] `src/lib/api/storage.ts` 구현:
  - [x] `uploadImage(file, productId)` - 이미지 업로드
  - [x] `deleteImage(url)` - 이미지 삭제

### 2.2 Zustand 스토어 구현
- [x] `productStore.ts` 구현:
  - [x] 상태 정의 (products, loading, error)
  - [x] 액션 정의 (fetchProducts, fetchProduct, createProduct, updateProduct, deleteProduct)
- [x] `uiStore.ts` 구현:
  - [x] 상태 정의 (filter, search, modal)
  - [x] 액션 정의 (setFilter, setSearch, openModal, closeModal)

### 2.3 상품 리스트 페이지
- [x] `HomePage.tsx` 기본 레이아웃 구현
- [x] `ProductList.tsx` 컴포넌트 구현:
  - [x] 상품 리스트 렌더링
  - [x] 로딩 상태 표시
  - [x] 에러 상태 표시
  - [x] 빈 상태 표시
- [x] `ProductCard.tsx` 컴포넌트 구현:
  - [x] 상품 이미지 표시
  - [x] 상품명 표시
  - [x] 상태 배지 표시
  - [x] 태그 표시
  - [x] 클릭 시 상세 페이지 이동
- [x] 반응형 그리드 레이아웃 적용
- [x] `StatusBadge.tsx` 컴포넌트 구현

### 2.4 상품 상세 페이지
- [x] `ProductDetailPage.tsx` 구현:
  - [x] 상품 정보 표시
  - [x] 이미지 표시
  - [x] 가격 정보 표시
  - [ ] 링크 리스트 표시 (다음 단계)
  - [x] 메모 표시
  - [x] 태그 표시
- [x] 편집 버튼 및 삭제 버튼 추가
- [x] 이미지 다운로드 기능 추가
- [x] 배송대행지 복사 기능 추가
- [x] 가격 계산 및 마진율 표시

### 2.5 상품 등록/수정 폼
- [ ] `ProductFormPage.tsx` 구현:
  - [ ] 상품명 입력 필드
  - [ ] 상태 선택 드롭다운
  - [ ] 태그 입력 필드
  - [ ] 메모 입력 필드
  - [ ] 가격 정보 입력 필드들
  - [ ] 이미지 업로드 영역
  - [ ] 링크 관리 영역
- [ ] 폼 validation 구현
- [ ] 저장 버튼 및 취소 버튼
- [ ] 저장 성공 시 리스트로 이동

---

## Phase 3: 이미지 처리

### 3.1 이미지 업로드 컴포넌트
- [ ] `ImageUploader.tsx` 컴포넌트 구현:
  - [ ] 파일 선택 버튼
  - [ ] 드래그 앤 드롭 영역 (데스크톱)
  - [ ] 이미지 미리보기
  - [ ] 업로드 진행률 표시
  - [ ] 업로드 완료 후 URL 반환
- [ ] 이미지 리사이징 (선택사항)
- [ ] 파일 크기 및 형식 검증

### 3.2 이미지 다운로드 기능
- [x] `ImageDownloader.tsx` 컴포넌트 구현:
  - [x] 다운로드 버튼
  - [x] CORS 이슈 해결 (fetch + Blob 사용)
  - [x] Blob 생성 및 다운로드 트리거
  - [x] 다운로드 성공 토스트 알림
- [x] 상세 페이지에 다운로드 버튼 추가
- [ ] 리스트 페이지 카드에 다운로드 버튼 추가 (선택사항)

### 3.3 이미지 최적화
- [ ] Lazy Loading 적용 (리스트 페이지)
- [ ] 이미지 포맷 최적화 (WebP 지원)
- [ ] 썸네일 생성 (선택사항)

---

## Phase 4: 계산기 및 유틸리티

### 4.1 가격 계산 유틸리티
- [ ] `src/utils/calculator.ts` 구현:
  - [ ] `calculateCostKrw(costCny, exchangeRate, shippingFee)` 함수
  - [ ] `calculateMargin(sellingPrice, costKrw)` 함수
  - [ ] `calculateMarginRate(sellingPrice, costKrw)` 함수

### 4.2 가격 계산기 컴포넌트
- [ ] `PriceCalculator.tsx` 컴포넌트 구현:
  - [ ] 위안화 원가 입력
  - [ ] 환율 입력 (기본값 200)
  - [ ] 배송비/관세 입력
  - [ ] 원화 원가 자동 계산 및 표시
  - [ ] 판매 예정가 입력
  - [ ] 마진금액 및 마진율 실시간 계산 및 표시
  - [ ] 마진율 색상 코딩 (빨강/노랑/초록)
- [ ] 상품 폼에 통합

### 4.3 배송대행지 복사 기능
- [x] `src/utils/clipboard.ts` 구현:
  - [x] `copyToClipboard(text)` 함수
- [x] 배송대행지 포맷 생성 함수 구현:
  - [x] `formatForShippingAgent(product, link)` 함수
- [x] 상세 페이지에 "배대지 복사" 버튼 추가
- [x] 복사 성공 토스트 알림

---

## Phase 5: 고급 기능

### 5.1 다중 링크 관리
- [x] `LinkManager.tsx` 컴포넌트 구현:
  - [x] 링크 리스트 표시
  - [x] 링크 추가 모달/시트
  - [x] 플랫폼 선택 드롭다운
  - [x] URL 입력 필드
  - [x] 옵션명/비고 입력 필드
  - [x] 링크 삭제 기능
- [x] 상품 폼에 통합
- [x] 상세 페이지에 표시

### 5.2 태그 시스템
- [ ] `TagInput.tsx` 컴포넌트 구현:
  - [ ] Chip 형태의 태그 입력
  - [ ] 태그 추가/삭제 기능
  - [ ] 기존 태그 자동완성 (선택사항)
- [ ] 상품 폼에 통합
- [ ] 리스트 페이지에 태그 표시

### 5.3 상태 필터링
- [x] 상태 필터 UI 구현:
  - [x] 탭 형태 또는 드롭다운
  - [x] 상태별 색상 코딩
- [x] 필터 상태 관리 (Zustand)
- [x] 필터 적용 시 상품 리스트 업데이트

### 5.4 검색 기능
- [x] 검색 입력 필드 추가
- [x] 검색어로 상품명/태그/메모 검색
- [x] 실시간 검색 결과 업데이트

### 5.5 상태 배지 컴포넌트
- [ ] `StatusBadge.tsx` 구현:
  - [ ] 상태별 색상 및 아이콘
  - [ ] 상태명 표시
- [ ] 카드 및 상세 페이지에 적용

---

## Phase 6: UI/UX 개선 및 최적화

### 6.1 네비게이션
- [ ] `BottomNav.tsx` 컴포넌트 구현 (모바일)
- [ ] 사이드바 네비게이션 구현 (태블릿/데스크톱)
- [ ] 라우트 연결

### 6.2 반응형 디자인
- [ ] 모바일 레이아웃 최적화 (< 768px)
- [ ] 태블릿 레이아웃 최적화 (768px ~ 1024px)
- [ ] 데스크톱 레이아웃 최적화 (> 1024px)
- [ ] 터치 최적화 (버튼 크기, 간격)

### 6.3 로딩 및 에러 처리
- [ ] 로딩 스피너 컴포넌트
- [ ] 에러 메시지 표시
- [ ] 빈 상태 컴포넌트
- [ ] 재시도 기능

### 6.4 토스트 알림
- [ ] Toast 컴포넌트 설정
- [ ] 성공/에러/정보 토스트 구현
- [ ] 주요 액션에 토스트 적용:
  - [ ] 상품 저장 성공
  - [ ] 상품 삭제 성공
  - [ ] 이미지 업로드 성공
  - [ ] 클립보드 복사 성공

### 6.5 성능 최적화
- [ ] 이미지 Lazy Loading
- [ ] 리스트 페이징 또는 무한 스크롤
- [ ] React.memo 적용 (필요한 컴포넌트)
- [ ] 코드 스플리팅 (라우트별)

### 6.6 접근성 개선
- [ ] 키보드 네비게이션 지원
- [ ] ARIA 레이블 추가
- [ ] 색상 대비 확인
- [ ] 포커스 관리

---

## Phase 7: 테스트 및 배포

### 7.1 기능 테스트
- [ ] 상품 CRUD 동작 확인
- [ ] 이미지 업로드/다운로드 확인
- [ ] 가격 계산 정확도 확인
- [ ] 링크 관리 기능 확인
- [ ] 상태 변경 및 필터링 확인
- [ ] 태그 기능 확인
- [ ] 검색 기능 확인

### 7.2 반응형 테스트
- [ ] 모바일 (375px, 414px) 테스트
- [ ] 태블릿 (768px, 1024px) 테스트
- [ ] 데스크톱 (1280px, 1920px) 테스트

### 7.3 브라우저 호환성 테스트
- [ ] Chrome (최신) 테스트
- [ ] Safari (iOS, macOS) 테스트
- [ ] Firefox (최신) 테스트

### 7.4 배포 준비
- [ ] 환경 변수 확인
- [ ] 빌드 에러 확인
- [ ] 프로덕션 빌드 테스트

### 7.5 Vercel 배포
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 및 동작 확인
- [ ] 도메인 연결 (선택사항)

---

## 추가 개선 사항 (선택)

### 향후 기능
- [ ] 상품 일괄 수정 기능
- [ ] 상품 내보내기/가져오기 (CSV, JSON)
- [ ] 통계 대시보드 (상태별 개수, 평균 마진율 등)
- [ ] 다크 모드 지원
- [ ] 다국어 지원 (한국어/영어)
- [ ] PWA 지원 (오프라인 기능)

---

## 진행 상황 요약

- **Phase 1:** 0/7 완료
- **Phase 2:** 0/5 완료
- **Phase 3:** 0/3 완료
- **Phase 4:** 0/3 완료
- **Phase 5:** 0/5 완료
- **Phase 6:** 0/6 완료
- **Phase 7:** 0/5 완료

**전체 진행률:** 0%

---

## 참고 사항

- 각 Phase는 순차적으로 진행하되, 필요시 병렬 작업 가능
- 체크리스트 업데이트는 작업 완료 시 즉시 진행
- 문제 발생 시 이슈를 기록하고 해결 방법 문서화
