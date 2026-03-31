import { NextRequest, NextResponse } from 'next/server'
import pool from '../../lib/db'

// POST — cadastrar novo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, email, telefone, aceita_newsletter } = body

    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e e-mail são obrigatórios.' },
        { status: 400 }
      )
    }

    // Verifica se e-mail já existe
    const exists = await pool.query('SELECT id FROM clientes WHERE email = $1', [email])
    if (exists.rows.length > 0) {
      return NextResponse.json(
        { error: 'Este e-mail já está cadastrado.' },
        { status: 409 }
      )
    }

    const result = await pool.query(
      `INSERT INTO clientes (nome, email, telefone, aceita_newsletter)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, telefone, aceita_newsletter, criado_em`,
      [nome, email, telefone || null, aceita_newsletter ?? true]
    )

    return NextResponse.json(
      { message: 'Cadastro realizado com sucesso! 🎉', cliente: result.rows[0] },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Erro ao cadastrar cliente:', err)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}

// GET — listar clientes (protegido por header de admin)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-token')

  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const result = await pool.query(
      'SELECT id, nome, email, telefone, aceita_newsletter, criado_em FROM clientes ORDER BY criado_em DESC'
    )
    return NextResponse.json({ clientes: result.rows })
  } catch (err) {
    console.error('Erro ao listar clientes:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
