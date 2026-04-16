CREATE TABLE t_p11125023_goods_showcase_platf.products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  old_price INTEGER,
  badge VARCHAR(10),
  category VARCHAR(100) NOT NULL DEFAULT 'Другое',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);