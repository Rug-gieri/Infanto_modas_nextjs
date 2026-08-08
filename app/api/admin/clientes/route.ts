import { NextRequest, NextResponse } from 'next/server'

import pool from '@/app/lib/db'
import type { ClienteDto } from '@/lib/server/admin-contracts'
import { mapCliente } from '@/lib/server/admin-mappers'
import { getAdminSessionToken, unauthorizedResponse } from '@/lib/server/admin-session'

const CLIENTE_FIELDS =
  'id, nome, email, telefone, cep, logradouro, numero, complemento, bairro, cidade, estado, referencia, aceita_newsletter, criado_em'

export async function GET() {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const result = await pool.query(
      `SELECT ${CLIENTE_FIELDS} FROM clientes ORDER BY criado_em DESC`
    )
    return NextResponse.json({ clientes: (result.rows as ClienteDto[]).map(mapCliente) })
  } catch (err) {
    console.error('Erro ao listar clientes:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const {
      id,
      nome,
      email,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      referencia,
      aceita_newsletter,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do cliente é obrigatório.' }, { status: 400 })
    }

    const exists = await pool.query('SELECT id FROM clientes WHERE id = $1', [id])
    if (exists.rows.length === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 })
    }

    const fields: string[] = []
    const values: (string | number | boolean | null)[] = []
    let paramIndex = 1

    const fieldMap: Record<string, string | boolean | undefined> = {
      nome,
      email,
      telefone,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      referencia,
      aceita_newsletter,
    }

    for (const [field, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        fields.push(`${field} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 })
    }

    values.push(id)
    const result = await pool.query(
      `UPDATE clientes SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING ${CLIENTE_FIELDS}`,
      values
    )

    return NextResponse.json({ cliente: mapCliente(result.rows[0] as ClienteDto) })
  } catch (err: any) {
    console.error('Erro ao atualizar cliente:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do cliente é obrigatório.' }, { status: 400 })
    }

    const result = await pool.query('DELETE FROM clientes WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Erro ao excluir cliente:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
