import { NextRequest } from 'next/server'
import pool from '../../../lib/db'
import { handleCorsOptions, jsonWithCors } from '../../../lib/cors'

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pedidoId = Number(params.id)

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
      return jsonWithCors(req, { error: 'Pedido invalido.' }, { status: 400 })
    }

    const pedidoResult = await pool.query(
      `SELECT
        p.id,
        p.status,
        p.status_pagamento,
        p.forma_pagamento,
        p.valor_total,
        p.nome_cliente,
        p.email_cliente,
        p.telefone_cliente,
        p.cep,
        p.logradouro,
        p.numero,
        p.complemento,
        p.bairro,
        p.cidade,
        p.estado,
        p.referencia,
        p.observacoes,
        p.criado_em,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'produto_id', pi.produto_id,
              'produto_nome', pr.nome,
              'quantidade', pi.quantidade,
              'preco_unitario', pi.preco_unitario,
              'imagem_url', pr.imagem_url
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'
        ) AS itens
      FROM pedidos p
      LEFT JOIN pedido_itens pi ON p.id = pi.pedido_id
      LEFT JOIN produtos pr ON pr.id = pi.produto_id
      WHERE p.id = $1
      GROUP BY p.id`,
      [pedidoId]
    )

    if (pedidoResult.rows.length === 0) {
      return jsonWithCors(req, { error: 'Pedido nao encontrado.' }, { status: 404 })
    }

    return jsonWithCors(req, { pedido: pedidoResult.rows[0] })
  } catch (err) {
    console.error('Erro ao buscar pedido do checkout:', err)
    return jsonWithCors(req, { error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
