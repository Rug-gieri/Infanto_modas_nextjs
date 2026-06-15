import { NextRequest, NextResponse } from 'next/server'
import pool from '../../../lib/db'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-token')

  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 })
  }

  try {
    const [clientesResult, produtosAtivosResult, pedidosMesResult, receitaResult] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total FROM clientes'),
      pool.query('SELECT COUNT(*)::int AS total FROM produtos WHERE ativo = true'),
      pool.query(
        `SELECT COUNT(*)::int AS total FROM pedidos
         WHERE criado_em >= date_trunc('month', NOW())
           AND criado_em < date_trunc('month', NOW()) + INTERVAL '1 month'`
      ),
      pool.query(
        `SELECT COALESCE(SUM(valor_total), 0)::numeric AS total FROM pedidos
         WHERE criado_em >= date_trunc('month', NOW())
           AND criado_em < date_trunc('month', NOW()) + INTERVAL '1 month'
           AND status != 'cancelado'`
      ),
    ])

    return NextResponse.json({
      totalClientes: clientesResult.rows[0].total,
      produtosAtivos: produtosAtivosResult.rows[0].total,
      pedidosDoMes: pedidosMesResult.rows[0].total,
      receitaEstimada: parseFloat(receitaResult.rows[0].total),
    })
  } catch (err) {
    console.error('Erro ao buscar métricas do dashboard:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
