import { NextRequest, NextResponse } from 'next/server'
import pool from '../../lib/db'
import { handleCorsOptions, jsonWithCors } from '../../lib/cors'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-token')
  return authHeader === process.env.ADMIN_SECRET
}

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

// POST — cadastrar novo cliente
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, email, telefone, aceita_newsletter } = body

    if (!nome || !email) {
      return jsonWithCors(
        req,
        { error: 'Nome e e-mail são obrigatórios.' },
        { status: 400 }
      )
    }

    // Verifica se e-mail já existe
    const exists = await pool.query('SELECT id FROM clientes WHERE email = $1', [email])
    if (exists.rows.length > 0) {
      return jsonWithCors(
        req,
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

    return jsonWithCors(
      req,
      { message: 'Cadastro realizado com sucesso! 🎉', cliente: result.rows[0] },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Erro ao cadastrar cliente:', err)
    return jsonWithCors(
      req,
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}

// GET — listar clientes (protegido por header de admin)
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return jsonWithCors(req, { error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const result = await pool.query(
      'SELECT id, nome, email, telefone, aceita_newsletter, criado_em FROM clientes ORDER BY criado_em DESC'
    )
    return jsonWithCors(req, { clientes: result.rows })
  } catch (err) {
    console.error('Erro ao listar clientes:', err)
    return jsonWithCors(req, { error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

// PUT — editar cliente
export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return jsonWithCors(req, { error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, nome, email, telefone, aceita_newsletter } = body

    if (!id) {
      return jsonWithCors(req, { error: 'ID do cliente é obrigatório.' }, { status: 400 })
    }

    const exists = await pool.query('SELECT id FROM clientes WHERE id = $1', [id])
    if (exists.rows.length === 0) {
      return jsonWithCors(req, { error: 'Cliente não encontrado.' }, { status: 404 })
    }

    const fields: string[] = []
    const values: (string | number | boolean | null)[] = []
    let paramIndex = 1

    const fieldMap: Record<string, string | undefined> = { nome, email, telefone, aceita_newsletter }
    for (const [field, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        fields.push(`${field} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (fields.length === 0) {
      return jsonWithCors(req, { error: 'Nenhum campo para atualizar.' }, { status: 400 })
    }

    values.push(id)
    const result = await pool.query(
      `UPDATE clientes SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING id, nome, email, telefone, aceita_newsletter, criado_em`,
      values
    )

    return jsonWithCors(req, { message: 'Cliente atualizado com sucesso!', cliente: result.rows[0] })
  } catch (err: any) {
    console.error('Erro ao atualizar cliente:', err)
    return jsonWithCors(req, { error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

// DELETE — excluir cliente
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return jsonWithCors(req, { error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return jsonWithCors(req, { error: 'ID do cliente é obrigatório.' }, { status: 400 })
    }

    const result = await pool.query('DELETE FROM clientes WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return jsonWithCors(req, { error: 'Cliente não encontrado.' }, { status: 404 })
    }

    return jsonWithCors(req, { message: 'Cliente removido com sucesso.' })
  } catch (err: any) {
    console.error('Erro ao excluir cliente:', err)
    return jsonWithCors(req, { error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
