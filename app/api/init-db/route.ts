import { NextResponse } from 'next/server'
import pool from '../../lib/db'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function GET() {
  try {
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schema = await fs.readFile(schemaPath, 'utf8')
    await pool.query(schema)

    return NextResponse.json({ message: 'Todas as tabelas criadas/verificadas com sucesso! ✅' })
  } catch (err: any) {
    console.error('Erro ao inicializar tabela:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
