# 배포 가이드 - Vercel

모바일에서도 사용할 수 있도록 Vercel에 배포하는 방법입니다.

## 1단계: Vercel 계정 생성

1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인 (또는 이메일로 가입)
3. 무료 플랜으로 시작 가능

## 2단계: Git 저장소 준비

### 로컬에서 Git 초기화 (아직 안 했다면)

```bash
git init
git add .
git commit -m "Initial commit"
```

### GitHub에 저장소 생성

1. GitHub에서 새 저장소 생성
2. 로컬 저장소와 연결:

```bash
git remote add origin https://github.com/your-username/catalog.git
git branch -M main
git push -u origin main
```

## 3단계: Vercel에 프로젝트 배포

### 방법 1: GitHub 연동 (권장)

1. Vercel 대시보드 → **Add New Project**
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `yarn build` (또는 `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `yarn install` (또는 `npm install`)

4. **Environment Variables** 추가:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_STORAGE_BUCKET=product-images
   ```

5. **Deploy** 클릭

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 4단계: 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 선택 → **Settings** → **Environment Variables**
2. 다음 변수 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_STORAGE_BUCKET`

## 5단계: 모바일 최적화 확인

배포 후 모바일에서 테스트:
1. Vercel에서 제공하는 URL로 접속
2. 모바일 브라우저에서 확인
3. 필요시 PWA 설정 추가 (선택사항)

## 6단계: 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 → **Settings** → **Domains**
2. 도메인 추가
3. DNS 설정 안내 따르기

## 문제 해결

### 빌드 에러
- 환경 변수가 제대로 설정되었는지 확인
- `yarn build` 로컬에서 테스트

### CORS 오류
- Supabase Storage CORS 설정 확인
- Vercel 도메인을 Supabase에 추가

### 이미지 업로드 안 됨
- Supabase Storage 정책 확인
- 환경 변수 확인

## 참고

- Vercel 무료 플랜: 충분히 사용 가능
- 자동 배포: GitHub에 push하면 자동 배포
- HTTPS: 자동 적용
