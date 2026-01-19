# 개발 단계 인증 설정 가이드

## 현재 상황

개발 단계에서 인증 없이도 작동하도록 코드를 수정했습니다. 하지만 **Supabase RLS (Row Level Security) 정책** 때문에 데이터베이스 접근이 막힐 수 있습니다.

## 해결 방법

### 방법 1: RLS 정책 임시 수정 (개발용)

Supabase SQL Editor에서 다음 SQL을 실행하여 개발용으로 RLS를 완화합니다:

```sql
-- 개발용: 모든 사용자가 products 테이블에 접근 가능하도록 수정
-- ⚠️ 프로덕션에서는 절대 사용하지 마세요!

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can insert own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

-- 개발용 정책 생성 (모든 사용자 접근 허용)
CREATE POLICY "Dev: Allow all operations"
  ON products FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

**주의**: 이 정책은 개발용입니다. 프로덕션 배포 전에 반드시 원래 정책으로 복원하세요.

### 방법 2: Supabase 인증 설정 (권장)

1. Supabase 대시보드 → **Authentication** → **Providers**
2. **Email** 제공자를 활성화
3. 간단한 로그인 컴포넌트 추가 (선택사항)

또는 개발용 테스트 계정을 생성하여 사용할 수 있습니다.

### 방법 3: 서비스 역할 키 사용 (개발용, 비권장)

서비스 역할 키를 사용하면 RLS를 우회할 수 있지만, 보안상 매우 위험합니다.
절대 프로덕션에서 사용하지 마세요!

## 프로덕션 배포 전 체크리스트

- [ ] RLS 정책을 원래대로 복원
- [ ] 인증 시스템 구현
- [ ] 코드에서 임시 사용자 ID 제거
- [ ] 보안 검토 완료

## 현재 코드 상태

`src/lib/api/storage.ts`와 `src/lib/api/products.ts`에서 인증이 없을 때 임시 사용자 ID를 사용하도록 수정했습니다. 이는 개발 단계에서만 사용해야 합니다.
