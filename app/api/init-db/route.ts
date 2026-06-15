import { NextResponse } from 'next/server'
import pool from '../../lib/db'

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        aceita_newsletter BOOLEAN DEFAULT true,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        descricao TEXT,
        preco NUMERIC(10,2) NOT NULL,
        categoria VARCHAR(30) NOT NULL,
        faixa_etaria VARCHAR(30),
        imagem_url VARCHAR(300) NOT NULL,
        badge VARCHAR(30),
        ativo BOOLEAN DEFAULT true,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        cliente_id INT REFERENCES clientes(id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'pendente',
        valor_total NUMERIC(10,2) DEFAULT 0,
        observacoes TEXT,
        criado_em TIMESTAMP DEFAULT NOW(),
        atualizado_em TIMESTAMP DEFAULT NOW()
      );
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedido_itens (
        id SERIAL PRIMARY KEY,
        pedido_id INT REFERENCES pedidos(id) ON DELETE CASCADE,
        produto_id INT REFERENCES produtos(id),
        quantidade INT DEFAULT 1,
        preco_unitario NUMERIC(10,2) NOT NULL
      );
    `)

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id ON pedido_itens(pedido_id);`)

    return NextResponse.json({ message: 'Todas as tabelas criadas/verificadas com sucesso! ✅' })
  } catch (err: any) {
    console.error('Erro ao inicializar tabela:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
