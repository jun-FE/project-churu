# Vercel 배포 단계별 가이드

## ✅ 1단계 완료: GitHub에 코드 푸시
코드가 성공적으로 GitHub에 업로드되었습니다!
- 저장소: https://github.com/jun-FE/project-churu.git

## 2단계: Vercel 배포

### 방법 1: 웹 브라우저에서 (가장 쉬움)

1. **Vercel 접속**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인 (또는 회원가입)

2. **프로젝트 Import**
   - 대시보드에서 **"Add New Project"** 클릭
   - **"Import Git Repository"** 섹션에서 `jun-FE/project-churu` 찾기
   - **"Import"** 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Vite (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `yarn build` (자동 설정됨)
   - **Output Directory**: `dist` (자동 설정됨)
   - **Install Command**: `yarn install` (자동 설정됨)

4. **환경 변수 추가** (중요!)
   - **Environment Variables** 섹션 클릭
   - 다음 3개 변수 추가:
   
   ```
   Name: VITE_SUPABASE_URL
   Value: (Supabase 대시보드에서 복사한 URL)
   
   Name: VITE_SUPABASE_ANON_KEY
   Value: (Supabase 대시보드에서 복사한 anon key)
   
   Name: VITE_SUPABASE_STORAGE_BUCKET
   Value: product-images
   ```

5. **Deploy 클릭**
   - 배포가 시작됩니다 (약 1-2분 소요)
   - 완료되면 URL이 제공됩니다!

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포 (대화형)
vercel

# 프로덕션 배포
vercel --prod
```

## 3단계: 배포 완료 후

배포가 완료되면:
- Vercel이 URL을 제공합니다: `https://catalog-xxx.vercel.app`
- 이 URL을 모바일 브라우저에서 열면 됩니다!

## 4단계: 모바일에서 사용하기

1. **모바일 브라우저에서 URL 열기**
2. **홈 화면에 추가**:
   - iOS: Safari → 공유 버튼 → 홈 화면에 추가
   - Android: Chrome → 메뉴 → 홈 화면에 추가
3. **앱처럼 사용 가능!**

## 자동 배포 설정

GitHub에 코드를 push하면 자동으로 재배포됩니다:
```bash
git add .
git commit -m "Update"
git push
```

## 문제 해결

### 빌드 실패
- 환경 변수가 제대로 설정되었는지 확인
- Vercel 대시보드 → Deployments → 로그 확인

### 이미지 업로드 안 됨
- Supabase Storage 정책 확인
- 환경 변수 확인
