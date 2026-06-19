import { NextRequest, NextResponse } from 'next/server'
import pool from '../../lib/db'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-token')
  return authHeader === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  const authenticated = checkAuth(req)
  const url = new URL(req.url)
  const ativos = url.searchParams.get('ativos')
  const categoria = url.searchParams.get('categoria')

  if (ativos === 'true') {
    try {
      const result = await pool.query(
        'SELECT * FROM produtos WHERE ativo = true ORDER BY criado_em DESC'
      )
      return NextResponse.json({ produtos: result.rows })
    } catch (err) {
      console.error('Erro ao listar produtos públicos:', err)
      return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
    }
  }

  if (!authenticated) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    let query = 'SELECT * FROM produtos'
    const params: (string | boolean)[] = []

    if (categoria) {
      query += ' WHERE categoria = $1'
      params.push(categoria)
    }

    query += ' ORDER BY criado_em DESC'

    const result = await pool.query(query, params.length ? params : undefined)
    return NextResponse.json({ produtos: result.rows })
  } catch (err) {
    console.error('Erro ao listar produtos:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { nome, descricao, preco, categoria, faixa_etaria, imagem_url, badge, ativo } = body

    if (!nome || preco == null || preco <= 0 || !categoria || !imagem_url) {
      return NextResponse.json(
        { error: 'Nome, preço (maior que zero), categoria e imagem são obrigatórios.' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO produtos (nome, descricao, preco, categoria, faixa_etaria, imagem_url, badge, ativo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [nome, descricao || null, preco, categoria, faixa_etaria || null, imagem_url, badge || null, ativo ?? true]
    )

    return NextResponse.json(
      { message: 'Produto criado com sucesso!', produto: result.rows[0] },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Erro ao criar produto:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório.' }, { status: 400 })
    }

    const exists = await pool.query('SELECT id FROM produtos WHERE id = $1', [id])
    if (exists.rows.length === 0) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 })
    }

    const fields: string[] = []
    const values: (string | number | boolean | null)[] = []
    let paramIndex = 1

    const allowedFields = ['nome', 'descricao', 'preco', 'categoria', 'faixa_etaria', 'imagem_url', 'badge', 'ativo']
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        fields.push(`${field} = $${paramIndex}`)
        values.push(body[field])
        paramIndex++
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 })
    }

    values.push(id)
    const result = await pool.query(
      `UPDATE produtos SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )

    return NextResponse.json({ message: 'Produto atualizado com sucesso!', produto: result.rows[0] })
  } catch (err: any) {
    console.error('Erro ao atualizar produto:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório.' }, { status: 400 })
    }

    const exists = await pool.query('SELECT id FROM produtos WHERE id = $1', [id])
    if (exists.rows.length === 0) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 })
    }

    await pool.query('DELETE FROM produtos WHERE id = $1', [id])

    return NextResponse.json({ message: 'Produto removido com sucesso.' })
  } catch (err: any) {
    console.error('Erro ao excluir produto:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
