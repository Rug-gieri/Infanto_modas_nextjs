import { NextResponse } from 'next/server'

import pool from '@/app/lib/db'
import type { PedidoDto } from '@/lib/server/admin-contracts'
import { mapClientePedido } from '@/lib/server/admin-mappers'
import { getAdminSessionToken, unauthorizedResponse } from '@/lib/server/admin-session'

export async function GET(_: Request, context: { params: Promise<{ clienteId: string }> }) {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
  }

  const { clienteId } = await context.params
  const clienteNumericId = Number(clienteId)

  if (!Number.isInteger(clienteNumericId)) {
    return NextResponse.json({ error: 'Cliente inválido.' }, { status: 400 })
  }

  try {
    const result = await pool.query(
      `SELECT p.*, c.nome AS cliente_nome, c.email AS cliente_email, c.telefone AS cliente_telefone,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'produto_id', pi.produto_id,
              'produto_nome', pr.nome,
              'quantidade', pi.quantidade,
              'preco_unitario', pi.preco_unitario
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS itens
       FROM pedidos p
       LEFT JOIN clientes c ON p.cliente_id = c.id
       LEFT JOIN pedido_itens pi ON p.id = pi.pedido_id
       LEFT JOIN produtos pr ON pi.produto_id = pr.id
       WHERE p.cliente_id = $1
       GROUP BY p.id, c.nome, c.email, c.telefone
       ORDER BY p.criado_em DESC`,
      [clienteNumericId]
    )

    return NextResponse.json({ pedidos: (result.rows as PedidoDto[]).map(mapClientePedido) })
  } catch (err) {
    console.error('Erro ao listar pedidos do cliente:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
