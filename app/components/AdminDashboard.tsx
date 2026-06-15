'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<{
    totalClientes: number
    produtosAtivos: number
    pedidosDoMes: number
    receitaEstimada: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    fetch('/api/admin/dashboard', {
      headers: { 'x-admin-token': token || '' },
    })
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total de Clientes', value: metrics?.totalClientes, icon: '👥' },
    { label: 'Produtos Ativos', value: metrics?.produtosAtivos, icon: '📦' },
    { label: 'Pedidos do Mês', value: metrics?.pedidosDoMes, icon: '📋' },
    {
      label: 'Receita Estimada',
      value: metrics?.receitaEstimada,
      icon: '💰',
      format: (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`,
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow p-0">
            <CardContent className="p-5 flex items-center gap-4">
              <span className="text-3xl">{card.icon}</span>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block w-6 h-6 border-[2.5px] border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : card.value != null ? (
                    card.format ? card.format(card.value) : card.value
                  ) : (
                    '—'
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{card.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
