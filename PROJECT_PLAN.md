# 프로젝트 계획서: Catalog (캣탈로그)

## 1. 프로젝트 개요
중국 사입 소싱 제품을 관리하는 개인용 모바일 웹 앱입니다.
사용자는 모바일과 데스크톱 환경 모두에서 제품 사진, 구매 링크(1688, 타오바오 등), 원가(위안화) 정보를 관리하고, 마진율 계산 및 배송대행지 신청 정보를 쉽게 복사할 수 있어야 합니다.

## 2. 기술 스펙 (Tech Stack)
- **Framework:** React + Vite (TypeScript)
- **Styling:** Tailwind CSS (Mobile First 디자인 필수)
- **UI Component:** shadcn/ui (Radix UI 기반) + Lucide React Icons
- **State Management:** Zustand
- **Backend & Database:** Supabase (Database, Storage, Authentication)
- **Hosting:** Vercel (권장)

## 3. 데이터베이스 스키마 (Supabase)

### `products` 테이블 (상품 정보)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('IDEA', 'SAMPLE_ORDERED', 'SAMPLE_CONFIRMED', 'ORDERED', 'SELLING', 'DROP')),
  image_url TEXT,
  cost_cny NUMERIC(10, 2),
  exchange_rate NUMERIC(5, 2) DEFAULT 200,
  shipping_fee_krw NUMERIC(10, 2),
  selling_price_krw NUMERIC(10, 2),
  memo TEXT,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
```

### `product_links` 테이블 (구매 링크)
```sql
CREATE TABLE product_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_product_links_product_id ON product_links(product_id);
```

### Storage 버킷 설정
- 버킷명: `product-images`
- Public Access: 허용 (이미지 다운로드용)
- File Size Limit: 5MB
- Allowed MIME Types: image/jpeg, image/png, image/webp

## 4. 핵심 기능 명세서 (Features Specification)

### A. 모바일 우선 UI/UX (Responsive Design)

#### A-1. 레이아웃 구조
- **모바일 (< 768px):**
  - 하단 탭 바 네비게이션 (Bottom Navigation Bar)
  - 카드 리스트 뷰 (세로 스크롤)
  - 풀스크린 모달/시트 형태의 상세 페이지
- **태블릿 (768px ~ 1024px):**
  - 사이드바 네비게이션 또는 상단 네비게이션
  - 그리드 뷰 (2-3열)
- **데스크톱 (> 1024px):**
  - 사이드바 네비게이션
  - 그리드 뷰 (3-4열) 또는 테이블 뷰 옵션

#### A-2. 터치 최적화
- 모든 버튼: `min-height: 44px` (iOS HIG 기준)
- 입력 필드: `min-height: 44px`, 충분한 패딩
- 카드 간격: 최소 `16px` 간격
- 스와이프 제스처 지원 (삭제, 상태 변경)

#### A-3. 네비게이션 구조
```
[홈(리스트)] [상태 필터] [검색] [설정]
```

### B. 상품 관리 (CRUD) & 이미지 처리

#### B-1. 상품 등록/수정 폼
**필수 입력 필드:**
- 상품명 (name): Text Input
- 대표 이미지 (image_url): Image Upload (Supabase Storage)
- 상태 (status): Select Dropdown
- 태그 (tags): Multi-select 또는 Chip Input
- 메모 (memo): Textarea

**가격 정보 입력:**
- 원가 위안화 (cost_cny): Number Input
- 환율 (exchange_rate): Number Input (기본값 200)
- 배송비/관세 (shipping_fee_krw): Number Input
- 판매 예정가 (selling_price_krw): Number Input

**링크 관리:**
- 링크 추가 버튼 → 모달/시트 열림
- 플랫폼 선택 (1688, Taobao, Xiaohongshu, Coupang 등)
- URL 입력
- 옵션명/비고 입력
- 저장된 링크 리스트 표시 및 삭제 기능

#### B-2. 이미지 업로드 기능
- **업로드 방식:**
  - 파일 선택 버튼 클릭
  - 드래그 앤 드롭 (데스크톱)
  - 이미지 미리보기 표시
  - 업로드 진행률 표시
- **Supabase Storage 연동:**
  - 파일명: `{user_id}/{product_id}/{timestamp}.{ext}`
  - 업로드 후 URL 반환 및 DB 저장

#### B-3. 이미지 다운로드 기능
- **구현 방법:**
  - 이미지 URL을 fetch로 가져와서 Blob 생성
  - `URL.createObjectURL()` 사용
  - `<a>` 태그의 `download` 속성 활용
  - 또는 File System Access API (지원 브라우저)
- **CORS 이슈 해결:**
  - Supabase Storage CORS 설정 확인
  - 필요시 Proxy API Route 생성 (Vercel Serverless Function)

### C. 가격 및 마진 계산기 (Calculator)

#### C-1. 환율 자동 계산
**계산 공식:**
```
원화 원가 = (위안화 원가 × 환율) + 배송비/관세
```

**UI 표시:**
- 입력 필드: 위안화 원가, 환율, 배송비/관세
- 자동 계산 결과: 원화 원가 (실시간 표시, 읽기 전용)

#### C-2. 마진율 대시보드
**계산 공식:**
```
마진금액 = 판매 예정가 - 원화 원가
마진율(%) = (마진금액 / 판매 예정가) × 100
```

**UI 표시:**
- 입력 필드: 판매 예정가
- 실시간 계산 결과:
  - 마진금액 (KRW)
  - 마진율 (%)
- 색상 코딩:
  - 마진율 < 30%: 빨간색 (위험)
  - 마진율 30% ~ 50%: 노란색 (주의)
  - 마진율 ≥ 50%: 초록색 (양호)

#### C-3. 계산기 컴포넌트 구조
```typescript
interface PriceCalculatorProps {
  costCny: number;
  exchangeRate: number;
  shippingFeeKrw: number;
  sellingPriceKrw: number;
}
```

### D. 유틸리티 (배대지 & 상태 관리)

#### D-1. 배송대행지 포맷 복사
**복사 형식:**
```
[상품명 / 옵션(메모) / 수량 1개 / 링크]
```

**구현 방법:**
- 버튼 클릭 시 템플릿 문자열 생성
- `navigator.clipboard.writeText()` 사용
- 복사 성공 토스트 알림 표시

**예시:**
```
[아이폰 케이스 / 투명 / 수량 1개 / https://detail.1688.com/offer/123456.html]
```

#### D-2. 상태(Status) 파이프라인
**상태 종류:**
- `IDEA`: 아이디어 단계
- `SAMPLE_ORDERED`: 샘플 주문 완료
- `SAMPLE_CONFIRMED`: 샘플 확인 완료
- `ORDERED`: 본 주문 완료
- `SELLING`: 판매 중
- `DROP`: 중단

**기능:**
- 상세 페이지: 드롭다운으로 상태 변경
- 리스트 페이지: 상태별 필터링 (탭 또는 드롭다운)
- 상태별 색상 코딩 및 아이콘 표시

#### D-3. 태그 시스템
- 태그 입력: Chip 형태의 입력 필드
- 태그 필터링: 리스트 페이지에서 태그 클릭 시 필터 적용
- 태그 자동완성: 기존 태그 목록 제안

## 5. 컴포넌트 구조 설계

### 5.1. 페이지 컴포넌트
```
src/
  pages/
    HomePage.tsx          # 상품 리스트 페이지
    ProductDetailPage.tsx # 상품 상세 페이지
    ProductFormPage.tsx   # 상품 등록/수정 페이지
```

### 5.2. 공통 컴포넌트
```
src/
  components/
    ui/                   # shadcn/ui 컴포넌트
      button.tsx
      card.tsx
      input.tsx
      select.tsx
      dialog.tsx
      sheet.tsx
      toast.tsx
    ProductCard.tsx       # 상품 카드 컴포넌트
    ProductList.tsx       # 상품 리스트 컴포넌트
    PriceCalculator.tsx   # 가격 계산기 컴포넌트
    ImageUploader.tsx     # 이미지 업로더 컴포넌트
    ImageDownloader.tsx   # 이미지 다운로더 컴포넌트
    LinkManager.tsx       # 링크 관리 컴포넌트
    StatusBadge.tsx       # 상태 배지 컴포넌트
    TagInput.tsx          # 태그 입력 컴포넌트
    BottomNav.tsx         # 하단 네비게이션
```

### 5.3. 상태 관리 (Zustand)
```
src/
  stores/
    productStore.ts       # 상품 CRUD 상태 관리
    uiStore.ts            # UI 상태 (모달, 필터 등)
```

### 5.4. API 레이어 (Supabase)
```
src/
  lib/
    supabase.ts           # Supabase 클라이언트 설정
    api/
      products.ts         # 상품 API 함수
      productLinks.ts     # 링크 API 함수
      storage.ts          # Storage API 함수
```

### 5.5. 유틸리티 함수
```
src/
  utils/
    calculator.ts         # 가격/마진 계산 함수
    formatter.ts          # 포맷팅 함수 (통화, 날짜 등)
    clipboard.ts          # 클립보드 유틸리티
```

## 6. 스타일링 가이드 (Tailwind CSS)

### 6.1. 반응형 브레이크포인트
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    }
  }
}
```

### 6.2. 색상 팔레트
- Primary: 파란색 계열 (상품 액션)
- Success: 초록색 (마진율 양호)
- Warning: 노란색 (마진율 주의)
- Danger: 빨간색 (마진율 위험, 삭제)
- Status Colors: 각 상태별 색상

### 6.3. 타이포그래피
- 모바일: 기본 폰트 크기 16px (줄임 방지)
- 제목: `text-xl` ~ `text-2xl` (모바일)
- 본문: `text-base` ~ `text-lg`

## 7. 보안 및 권한 관리

### 7.1. Supabase RLS (Row Level Security)
```sql
-- products 테이블 RLS 정책
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);
```

### 7.2. Storage 정책
- 사용자는 자신의 폴더에만 업로드 가능
- Public 읽기 권한 (이미지 다운로드용)

## 8. 성능 최적화

### 8.1. 이미지 최적화
- 이미지 리사이징 (업로드 시)
- Lazy Loading (리스트 페이지)
- WebP 포맷 지원

### 8.2. 데이터 페이징
- 리스트 페이지: 무한 스크롤 또는 페이지네이션
- 페이지당 20개 항목

### 8.3. 캐싱 전략
- Zustand를 통한 클라이언트 캐싱
- React Query 고려 (필요시)

## 9. 배포 및 환경 설정

### 9.1. 환경 변수
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

### 9.2. Vercel 배포 설정
- Build Command: `yarn build`
- Output Directory: `dist`
- Environment Variables 설정

## 10. 테스트 계획

### 10.1. 기능 테스트
- [ ] 상품 CRUD 동작 확인
- [ ] 이미지 업로드/다운로드 확인
- [ ] 가격 계산 정확도 확인
- [ ] 링크 관리 기능 확인
- [ ] 상태 변경 및 필터링 확인

### 10.2. 반응형 테스트
- [ ] 모바일 (375px, 414px)
- [ ] 태블릿 (768px, 1024px)
- [ ] 데스크톱 (1280px, 1920px)

### 10.3. 브라우저 호환성
- [ ] Chrome (최신)
- [ ] Safari (iOS, macOS)
- [ ] Firefox (최신)

## 11. 구현 우선순위

### Phase 1: 기초 설정 및 인프라
1. 프로젝트 초기화 (Vite + React + TypeScript)
2. Tailwind CSS 설정
3. shadcn/ui 설치 및 기본 컴포넌트 설정
4. Supabase 프로젝트 생성 및 데이터베이스 스키마 구축
5. Zustand 스토어 기본 구조 설정

### Phase 2: 핵심 CRUD 기능
1. 상품 리스트 페이지 구현
2. 상품 상세 페이지 구현
3. 상품 등록/수정 폼 구현
4. Supabase API 연동 (CRUD)

### Phase 3: 이미지 처리
1. 이미지 업로드 기능 구현
2. 이미지 다운로드 기능 구현
3. 이미지 미리보기 및 최적화

### Phase 4: 계산기 및 유틸리티
1. 가격 계산기 컴포넌트 구현
2. 마진율 대시보드 구현
3. 배송대행지 복사 기능 구현

### Phase 5: 고급 기능
1. 다중 링크 관리 기능 구현
2. 태그 시스템 구현
3. 상태 필터링 기능 구현
4. 검색 기능 구현

### Phase 6: UI/UX 개선 및 최적화
1. 모바일 반응형 디자인 완성
2. 로딩 상태 및 에러 처리
3. 성능 최적화
4. 접근성 개선
