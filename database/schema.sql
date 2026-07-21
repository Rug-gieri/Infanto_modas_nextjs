CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  cep VARCHAR(9),
  logradouro VARCHAR(150),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  referencia VARCHAR(150),
  aceita_newsletter BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
  categoria VARCHAR(30) NOT NULL,
  faixa_etaria VARCHAR(30),
  imagem_url VARCHAR(300) NOT NULL,
  badge VARCHAR(30),
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pedido_status') THEN
    CREATE TYPE pedido_status AS ENUM ('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
  status pedido_status NOT NULL DEFAULT 'pendente',
  valor_total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (valor_total >= 0),
  forma_pagamento VARCHAR(30) NOT NULL DEFAULT 'pix_manual',
  status_pagamento VARCHAR(20) NOT NULL DEFAULT 'pendente',
  nome_cliente VARCHAR(100),
  email_cliente VARCHAR(150),
  telefone_cliente VARCHAR(20),
  cep VARCHAR(9),
  logradouro VARCHAR(150),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  referencia VARCHAR(150),
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INT NOT NULL REFERENCES produtos(id),
  quantidade INT NOT NULL DEFAULT 1 CHECK (quantidade > 0),
  preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario > 0)
);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_criado_em ON clientes(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_criado_em ON produtos(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em ON pedidos(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id ON pedido_itens(pedido_id);

ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cep VARCHAR(9);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS logradouro VARCHAR(150);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS numero VARCHAR(20);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS complemento VARCHAR(100);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS bairro VARCHAR(100);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS estado VARCHAR(2);
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS referencia VARCHAR(150);

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(30) NOT NULL DEFAULT 'pix_manual';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS status_pagamento VARCHAR(20) NOT NULL DEFAULT 'pendente';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS nome_cliente VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS email_cliente VARCHAR(150);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS telefone_cliente VARCHAR(20);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cep VARCHAR(9);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS logradouro VARCHAR(150);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS numero VARCHAR(20);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS complemento VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS bairro VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cidade VARCHAR(100);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS estado VARCHAR(2);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS referencia VARCHAR(150);
