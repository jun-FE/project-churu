-- ============================================
-- 외래 키 제약 조건 제거 (개인용 앱)
-- ============================================

-- products 테이블의 user_id 외래 키 제약 조건 제거
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_user_id_fkey;

-- 제약 조건이 제거되었는지 확인
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type
FROM information_schema.table_constraints AS tc 
WHERE tc.table_name = 'products' 
AND tc.constraint_type = 'FOREIGN KEY';
