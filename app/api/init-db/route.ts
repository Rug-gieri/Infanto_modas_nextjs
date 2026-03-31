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

    return NextResponse.json({ message: 'Tabela "clientes" criada/verificada com sucesso! ✅' })
  } catch (err: any) {
    console.error('Erro ao inicializar tabela:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
