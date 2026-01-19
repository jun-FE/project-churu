# Supabase API 키 찾는 방법

## 단계별 가이드

### 1. Supabase 대시보드 접속
- https://supabase.com/dashboard 접속
- 프로젝트 선택

### 2. Settings 메뉴 클릭
- 왼쪽 사이드바에서 **Settings** (톱니바퀴 아이콘) 클릭

### 3. API 메뉴 클릭
- Settings 하위 메뉴에서 **API** 클릭

### 4. 필요한 정보 찾기

#### Project URL
- 페이지 상단의 **"Project URL"** 섹션
- 예시: `https://abcdefghijklmnop.supabase.co`
- 복사 버튼 클릭하여 복사

#### anon public 키
- **"Project API keys"** 섹션에서 찾을 수 있습니다
- **"anon public"** 또는 **"anon"** 라벨이 있는 키
- 복사 버튼을 클릭하여 복사
- ⚠️ **주의**: "service_role" 키는 절대 사용하지 마세요! (보안상 위험)

## 화면 구성 예시

```
Settings > API 페이지

┌─────────────────────────────────────┐
│ Project URL                         │
│ https://xxx.supabase.co  [복사]    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Project API keys                    │
│                                     │
│ anon public                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6...    │
│ [복사]                              │
│                                     │
│ service_role (비밀)                 │
│ ⚠️ 이 키는 사용하지 마세요!         │
└─────────────────────────────────────┘
```

## .env.local 파일에 입력

복사한 값들을 다음과 같이 입력하세요:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_STORAGE_BUCKET=product-images
```

## 문제 해결

### API 메뉴가 보이지 않을 때
- 프로젝트가 완전히 생성되었는지 확인하세요
- 페이지를 새로고침해보세요

### 키가 너무 길어서 복사가 안 될 때
- 복사 버튼을 사용하세요 (수동 선택보다 안전합니다)
- 전체 키가 복사되었는지 확인하세요
