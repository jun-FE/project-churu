-- ============================================
-- Catalog 프로젝트 데이터베이스 스키마
-- ============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- products 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS products (
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- ============================================
-- product_links 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS product_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 인덱스 생성
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_links_product_id ON product_links(product_id);

-- ============================================
-- Row Level Security (RLS) 정책 설정
-- ============================================

-- products 테이블 RLS 활성화
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_links ENABLE ROW LEVEL SECURITY;

-- products 테이블 정책
-- 사용자는 자신의 상품만 조회 가능
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 상품만 생성 가능
CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 상품만 수정 가능
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 상품만 삭제 가능
CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- product_links 테이블 정책
-- 사용자는 자신의 상품의 링크만 조회 가능
CREATE POLICY "Users can view own product links"
  ON product_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_links.product_id
      AND products.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 상품의 링크만 생성 가능
CREATE POLICY "Users can insert own product links"
  ON product_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_links.product_id
      AND products.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 상품의 링크만 수정 가능
CREATE POLICY "Users can update own product links"
  ON product_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_links.product_id
      AND products.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_links.product_id
      AND products.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 상품의 링크만 삭제 가능
CREATE POLICY "Users can delete own product links"
  ON product_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_links.product_id
      AND products.user_id = auth.uid()
    )
  );
