import { NextRequest, NextResponse } from 'next/server'

import pool from '@/app/lib/db'
import type { ProdutoDto } from '@/lib/server/admin-contracts'
import { mapProduto } from '@/lib/server/admin-mappers'
import { getAdminSessionToken, unauthorizedResponse } from '@/lib/server/admin-session'

function isValidCloudinaryImageUrl(value: unknown) {
  if (typeof value !== 'string') {
    return false
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

function normalizeProduto(produto: Record<string, unknown>) {
  return {
    ...produto,
    preco:
      typeof produto.preco === 'number'
        ? produto.preco
        : typeof produto.preco === 'string'
          ? Number(produto.preco)
          : 0,
  }
}

export async function GET(request: NextRequest) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const url = new URL(request.url)
    const categoria = url.searchParams.get('categoria')

    let query = 'SELECT * FROM produtos'
    const params: (string | boolean)[] = []

    if (categoria) {
      query += ' WHERE categoria = $1'
      params.push(categoria)
    }

    query += ' ORDER BY criado_em DESC'

    const result = await pool.query(query, params.length ? params : undefined)
    const produtos = (result.rows as Record<string, unknown>[]).map(normalizeProduto)

    return NextResponse.json({ produtos: produtos.map((produto) => mapProduto(produto as unknown as ProdutoDto)) })
  } catch (err) {
    console.error('Erro ao listar produtos:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { nome, descricao, preco, categoria, faixa_etaria, imagem_url, badge, ativo } = body

    if (!nome || preco == null || preco <= 0 || !categoria || !imagem_url) {
      return NextResponse.json(
        { error: 'Nome, preço (maior que zero), categoria e imagem são obrigatórios.' },
        { status: 400 }
      )
    }

    if (!isValidCloudinaryImageUrl(imagem_url)) {
      return NextResponse.json(
        { error: 'A imagem deve ser uma URL HTTPS válida do Cloudinary.' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO produtos (nome, descricao, preco, categoria, faixa_etaria, imagem_url, badge, ativo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [nome, descricao || null, preco, categoria, faixa_etaria || null, imagem_url, badge || null, ativo ?? true]
    )

    const produto = normalizeProduto(result.rows[0] as Record<string, unknown>)
    return NextResponse.json({ produto: mapProduto(produto as unknown as ProdutoDto) }, { status: 201 })
  } catch (err: any) {
    console.error('Erro ao criar produto:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório.' }, { status: 400 })
    }

    const exists = await pool.query('SELECT id FROM produtos WHERE id = $1', [id])
    if (exists.rows.length === 0) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 })
    }

    if (body.imagem_url !== undefined && !isValidCloudinaryImageUrl(body.imagem_url)) {
      return NextResponse.json(
        { error: 'A imagem deve ser uma URL HTTPS válida do Cloudinary.' },
        { status: 400 }
      )
    }

    const allowedFields = ['nome', 'descricao', 'preco', 'categoria', 'faixa_etaria', 'imagem_url', 'badge', 'ativo']
    const fields: string[] = []
    const values: (string | number | boolean | null)[] = []
    let paramIndex = 1

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

    const produto = normalizeProduto(result.rows[0] as Record<string, unknown>)
    return NextResponse.json({ produto: mapProduto(produto as unknown as ProdutoDto) })
  } catch (err: any) {
    console.error('Erro ao atualizar produto:', err)
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
      return NextResponse.json({ error: 'ID do produto é obrigatório.' }, { status: 400 })
    }

    const exists = await pool.query('SELECT id FROM produtos WHERE id = $1', [id])
    if (exists.rows.length === 0) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 })
    }

    await pool.query('DELETE FROM produtos WHERE id = $1', [id])

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Erro ao excluir produto:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
