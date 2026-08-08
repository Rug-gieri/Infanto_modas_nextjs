import { NextResponse } from 'next/server'

import pool from '@/app/lib/db'
import type { DashboardMetricsDto } from '@/lib/server/admin-contracts'
import { mapDashboardMetrics } from '@/lib/server/admin-mappers'
import { getAdminSessionToken, unauthorizedResponse } from '@/lib/server/admin-session'

export async function GET() {
  if (!(await getAdminSessionToken())) {
    return unauthorizedResponse()
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

    const metrics: DashboardMetricsDto = {
      totalClientes: clientesResult.rows[0].total,
      produtosAtivos: produtosAtivosResult.rows[0].total,
      pedidosDoMes: pedidosMesResult.rows[0].total,
      receitaEstimada: parseFloat(receitaResult.rows[0].total),
    }

    return NextResponse.json({ metrics: mapDashboardMetrics(metrics) })
  } catch (err) {
    console.error('Erro ao buscar métricas do dashboard:', err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
