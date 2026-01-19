# 빠른 배포 가이드

## 가장 빠른 방법 (5분 안에 배포)

### 1. GitHub에 코드 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 만들고 연결
git remote add origin https://github.com/your-username/catalog.git
git branch -M main
git push -u origin main
```

### 2. Vercel에서 배포

1. https://vercel.com 접속
2. **Sign Up** → GitHub로 로그인
3. **Add New Project** 클릭
4. 방금 만든 GitHub 저장소 선택
5. **Import** 클릭
6. 환경 변수 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_STORAGE_BUCKET`
7. **Deploy** 클릭

### 3. 완료!

배포가 완료되면 Vercel이 URL을 제공합니다.
예: `https://catalog-xxx.vercel.app`

이 URL을 모바일 브라우저에서 열면 됩니다!

## 모바일에서 바로 열기

배포된 URL을 모바일 브라우저 주소창에 입력하거나,
홈 화면에 추가하면 앱처럼 사용할 수 있습니다.

## 다음 업데이트

코드를 수정하고 GitHub에 push하면 자동으로 재배포됩니다!
