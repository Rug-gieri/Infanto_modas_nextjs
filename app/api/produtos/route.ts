import { NextRequest, NextResponse } from 'next/server'
import pool from '../../lib/db'
import { handleCorsOptions, jsonWithCors } from '../../lib/cors'

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

function normalizeProdutos(produtos: Record<string, unknown>[]) {
  return produtos.map(normalizeProduto)
}

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const ativos = url.searchParams.get('ativos')

  if (ativos !== 'true') {
    return jsonWithCors(req, { error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM produtos WHERE ativo = true ORDER BY criado_em DESC'
    )
    return jsonWithCors(req, { produtos: normalizeProdutos(result.rows) })
  } catch (err) {
    console.error('Erro ao listar produtos públicos:', err)
    return jsonWithCors(req, { error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
