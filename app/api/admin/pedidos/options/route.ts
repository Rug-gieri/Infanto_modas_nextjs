import { NextResponse } from 'next/server'

import pool from '@/app/lib/db'
import type { ClienteDto, ProdutoDto } from '@/lib/server/admin-contracts'
import { mapClienteInfo, mapProdutoOption } from '@/lib/server/admin-mappers'
import { getAdminSessionToken, unauthorizedResponse } from '@/lib/server/admin-session'

export async function GET() {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  try {
    const [clientesResult, produtosResult] = await Promise.all([
      pool.query('SELECT id, nome, email, telefone FROM clientes ORDER BY nome ASC'),
      pool.query('SELECT id, nome, preco::float8 AS preco FROM produtos ORDER BY nome ASC'),
    ])

    return NextResponse.json({
      clientes: (clientesResult.rows as ClienteDto[]).map(mapClienteInfo),
      produtos: (produtosResult.rows as ProdutoDto[]).map(mapProdutoOption),
    })
  } catch (err) {
    console.error('Erro ao carregar opcoes do pedido:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
