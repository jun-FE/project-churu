# Supabase 설정 진행 상황 체크리스트

## 완료된 항목
- [x] Supabase 프로젝트 생성
- [x] Storage 버킷 생성 (`product-images`)
- [x] Storage 정책 설정 (SQL Editor에서 일괄 추가 완료)

## 다음 단계

### 1. 데이터베이스 스키마 생성 확인
- [ ] `supabase/schema.sql` 파일을 SQL Editor에서 실행했는지 확인
- [ ] Table Editor에서 `products`와 `product_links` 테이블이 생성되었는지 확인

### 2. 환경 변수 설정
- [ ] `.env.local` 파일 생성
- [ ] Supabase 대시보드 → Settings → API에서 값 복사
- [ ] 환경 변수 입력 완료

### 3. 연결 테스트
- [ ] `yarn dev` 실행
- [ ] 브라우저 콘솔에서 에러 확인
