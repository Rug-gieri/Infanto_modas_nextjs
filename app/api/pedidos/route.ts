import { NextRequest, NextResponse } from 'next/server'
import pool from '../../lib/db'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-token')
  return authHeader === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')

    let query = `
      SELECT p.*, c.nome AS cliente_nome, c.email AS cliente_email, c.telefone AS cliente_telefone,
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
    `
    const params: string[] = []

    if (status) {
      query += ' WHERE p.status = $1'
      params.push(status)
    }

    query += ' GROUP BY p.id, c.nome, c.email, c.telefone ORDER BY p.criado_em DESC'

    const result = await pool.query(query, params.length ? params : undefined)
    return NextResponse.json({ pedidos: result.rows })
  } catch (err) {
    console.error('Erro ao listar pedidos:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  const client = await pool.connect()
  try {
    const body = await req.json()
    const { cliente_id, observacoes, itens } = body

    if (!cliente_id) {
      return NextResponse.json({ error: 'Cliente é obrigatório.' }, { status: 400 })
    }

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return NextResponse.json({ error: 'O pedido deve ter pelo menos um item.' }, { status: 400 })
    }

    await client.query('BEGIN')

    let valor_total = 0

    for (const item of itens) {
      const produto = await client.query('SELECT id, preco FROM produtos WHERE id = $1 AND ativo = true', [item.produto_id])
      if (produto.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: `Produto ID ${item.produto_id} não encontrado ou inativo.` }, { status: 400 })
      }
      valor_total += Number(produto.rows[0].preco) * (item.quantidade || 1)
    }

    const pedidoResult = await client.query(
      `INSERT INTO pedidos (cliente_id, observacoes, valor_total)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cliente_id, observacoes || null, valor_total]
    )

    const pedidoId = pedidoResult.rows[0].id

    for (const item of itens) {
      const produto = await client.query('SELECT preco FROM produtos WHERE id = $1', [item.produto_id])
      await client.query(
        `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.produto_id, item.quantidade || 1, produto.rows[0].preco]
      )
    }

    await client.query('COMMIT')

    return NextResponse.json(
      { message: 'Pedido criado com sucesso!', pedido: pedidoResult.rows[0] },
      { status: 201 }
    )
  } catch (err: any) {
    await client.query('ROLLBACK')
    console.error('Erro ao criar pedido:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  } finally {
    client.release()
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, status } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do pedido é obrigatório.' }, { status: 400 })
    }

    if (!status) {
      return NextResponse.json({ error: 'Status é obrigatório.' }, { status: 400 })
    }

    const validStatuses = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido.' }, { status: 400 })
    }

    const result = await pool.query(
      'UPDATE pedidos SET status = $1, atualizado_em = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Status atualizado com sucesso!', pedido: result.rows[0] })
  } catch (err: any) {
    console.error('Erro ao atualizar pedido:', err)
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
      return NextResponse.json({ error: 'ID do pedido é obrigatório.' }, { status: 400 })
    }

    const result = await pool.query('DELETE FROM pedidos WHERE id = $1', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Pedido removido com sucesso.' })
  } catch (err: any) {
    console.error('Erro ao excluir pedido:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
