-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos (cache local do Bling)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  bling_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2),
  image_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de favoritos
CREATE TABLE favorites (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, product_id),
  favorited_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de itens no carrinho
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de log de sincronização com Bling (opcional)
CREATE TABLE bling_sync_log (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('product', 'order', 'stock')),
  bling_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'synced', 'failed')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
