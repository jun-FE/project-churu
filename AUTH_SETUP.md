# Supabase 이메일 인증 설정 가이드 (무료 플랜)

## 무료 플랜에서도 가능합니다!

Supabase 무료 플랜에서도 이메일 인증을 사용할 수 있습니다.

## 방법 1: Supabase 대시보드에서 이메일 인증 활성화

### 1단계: Authentication 설정
1. Supabase 대시보드 → **Authentication** 메뉴 클릭
2. **Providers** 탭 클릭
3. **Email** 제공자 찾기
4. **Enable Email provider** 토글을 켜기 (ON)

### 2단계: 이메일 템플릿 설정 (선택사항)
- **Email Templates** 탭에서 이메일 템플릿 커스터마이징 가능
- 기본 설정으로도 작동합니다

### 3단계: 테스트 계정 생성
1. **Authentication** → **Users** 탭
2. **Add user** → **Create new user** 클릭
3. 이메일과 비밀번호 입력
4. **Create user** 클릭

## 방법 2: 앱에서 직접 회원가입/로그인 (권장)

앱에 간단한 로그인 컴포넌트를 추가하면 더 편리합니다.

## Storage 정책 확인

이미지 업로드가 안 된다면 Storage 정책을 확인하세요:

1. **Storage** → **product-images** 버킷 클릭
2. **Policies** 탭 확인
3. `supabase/dev-policies.sql`의 Storage 정책이 적용되었는지 확인

## 문제 해결

### 이미지 업로드가 여전히 안 될 때

Storage 정책을 다시 확인하고, 필요하면 다음 SQL을 실행:

```sql
-- Storage 정책 완전히 열기
DROP POLICY IF EXISTS "Allow all operations on product-images" ON storage.objects;

CREATE POLICY "Allow all operations on product-images"
  ON storage.objects FOR ALL
  TO public
  USING (bucket_id = 'product-images'::text)
  WITH CHECK (bucket_id = 'product-images'::text);
```
