'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Minus } from 'lucide-react'

interface ClienteInfo {
  id: number
  nome: string
  email: string
  telefone: string | null
}

interface PedidoItem {
  id: number
  produto_id: number
  produto_nome: string
  quantidade: number
  preco_unitario: number
}

interface Pedido {
  id: number
  cliente_id: number
  cliente_nome: string | null
  cliente_email: string | null
  status: string
  valor_total: number
  observacoes: string | null
  criado_em: string
  itens: PedidoItem[]
}

interface ProdutoOption {
  id: number
  nome: string
  preco: number
}

interface NovoItem {
  produto_id: number
  quantidade: number
}

const STATUSES = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado']
const STATUS_LABELS: Record<string, string> = {
  pendente: '⏳ Pendente',
  confirmado: '✅ Confirmado',
  enviado: '📦 Enviado',
  entregue: '🏠 Entregue',
  cancelado: '❌ Cancelado',
}
const NEXT_STATUS: Record<string, string | null> = {
  pendente: 'confirmado',
  confirmado: 'enviado',
  enviado: 'entregue',
  entregue: null,
  cancelado: null,
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMes, setFiltroMes] = useState('')

  const [detalheDialogOpen, setDetalheDialogOpen] = useState(false)
  const [detalhePedido, setDetalhePedido] = useState<Pedido | null>(null)

  const [criarDialogOpen, setCriarDialogOpen] = useState(false)
  const [searchCliente, setSearchCliente] = useState('')
  const [clientes, setClientes] = useState<ClienteInfo[]>([])
  const [selectedCliente, setSelectedCliente] = useState<ClienteInfo | null>(null)
  const [itens, setItens] = useState<NovoItem[]>([])
  const [produtos, setProdutos] = useState<ProdutoOption[]>([])
  const [observacoes, setObservacoes] = useState('')
  const [criando, setCriando] = useState(false)

  useEffect(() => {
    fetchPedidos()
  }, [])

  function getToken() {
    return localStorage.getItem('admin_token') || ''
  }

  function getHeader() {
    return {
      'Content-Type': 'application/json',
      'x-admin-token': getToken(),
    }
  }

  async function fetchPedidos() {
    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', { headers: { 'x-admin-token': getToken() } })
      const data = await res.json()
      if (res.ok) setPedidos(data.pedidos)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function changeStatus(pedidoId: number, newStatus: string) {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify({ id: pedidoId, status: newStatus }),
      })
      if (res.ok) fetchPedidos()
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
    }
  }

  function openDetalhe(pedido: Pedido) {
    setDetalhePedido(pedido)
    setDetalheDialogOpen(true)
  }

  async function openCriar() {
    setSearchCliente('')
    setSelectedCliente(null)
    setItens([])
    setObservacoes('')
    setCriarDialogOpen(true)
    try {
      const [clientesRes, produtosRes] = await Promise.all([
        fetch('/api/clientes', { headers: { 'x-admin-token': getToken() } }),
        fetch('/api/produtos', { headers: { 'x-admin-token': getToken() } }),
      ])
      const clientesData = await clientesRes.json()
      const produtosData = await produtosRes.json()
      if (clientesRes.ok) setClientes(clientesData.clientes || [])
      if (produtosRes.ok) setProdutos(produtosData.produtos || [])
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    }
  }

  function addItem() {
    setItens([...itens, { produto_id: 0, quantidade: 1 }])
  }

  function removeItem(index: number) {
    setItens(itens.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: keyof NovoItem, value: number) {
    const updated = [...itens]
    updated[index] = { ...updated[index], [field]: value }
    setItens(updated)
  }

  async function handleCriar() {
    if (!selectedCliente || itens.length === 0) return
    setCriando(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: getHeader(),
        body: JSON.stringify({
          cliente_id: selectedCliente.id,
          observacoes: observacoes || null,
          itens: itens.map((i) => ({ produto_id: i.produto_id, quantidade: i.quantidade })),
        }),
      })
      if (res.ok) {
        setCriarDialogOpen(false)
        fetchPedidos()
      }
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
    } finally {
      setCriando(false)
    }
  }

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchCliente.toLowerCase()) ||
      c.email.toLowerCase().includes(searchCliente.toLowerCase())
  )

  const filteredPedidos = filtroMes
    ? pedidos.filter((p) => {
        const d = new Date(p.criado_em)
        const [year, month] = filtroMes.split('-')
        return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month)
      })
    : pedidos

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatPrice(v: number) {
    return `R$ ${v.toFixed(2).replace('.', ',')}`
  }

  function calcularTotalItens() {
    return itens.reduce((total, item) => {
      const produto = produtos.find((p) => p.id === item.produto_id)
      return total + (produto ? produto.preco * item.quantidade : 0)
    }, 0)
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto py-8 px-4">
        <div className="p-12 text-center text-muted-foreground">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Pedidos</h2>
        <div className="flex gap-2 items-center">
          <input
            type="month"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-1.5 text-sm"
          />
          {filtroMes && (
            <Button variant="ghost" size="sm" onClick={() => setFiltroMes('')}>Limpar</Button>
          )}
          <Button variant="secondary" size="sm" onClick={fetchPedidos}>🔄 Atualizar</Button>
          <Button size="sm" onClick={openCriar}>
            <Plus className="w-4 h-4 mr-1" />
            Novo Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STATUSES.map((status) => {
          const pedidosStatus = filteredPedidos.filter((p) => p.status === status)
          return (
            <div key={status} className="space-y-3">
              <h3 className="font-display text-sm font-bold text-foreground sticky top-0 bg-background py-1 z-10">
                {STATUS_LABELS[status]} ({pedidosStatus.length})
              </h3>
              {pedidosStatus.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Vazio</p>
              ) : (
                pedidosStatus.map((pedido) => (
                  <Card
                    key={pedido.id}
                    className="rounded-xl border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer p-0"
                    onClick={() => openDetalhe(pedido)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">#{pedido.id}</span>
                        <span className="text-xs font-bold">{formatPrice(pedido.valor_total)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {pedido.cliente_nome || 'Cliente removido'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(pedido.criado_em)}</p>
                      {pedido.itens?.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                        </p>
                      )}
                      {NEXT_STATUS[status] && (
                        <div className="mt-2 pt-2 border-t border-border" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => changeStatus(pedido.id, NEXT_STATUS[status]!)}
                          >
                            {status === 'pendente' ? '✅ Confirmar'
                              : status === 'confirmado' ? '📦 Enviar'
                              : status === 'enviado' ? '🏠 Entregar'
                              : '▶ Avançar'}
                          </Button>
                        </div>
                      )}
                      {status !== 'cancelado' && NEXT_STATUS[status] === null && (
                        <div className="mt-2 pt-2 border-t border-border" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => changeStatus(pedido.id, 'cancelado')}
                          >
                            ❌ Cancelar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )
        })}
      </div>

      {/* Detalhe Dialog */}
      <Dialog open={detalheDialogOpen} onOpenChange={setDetalheDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pedido #{detalhePedido?.id}</DialogTitle>
          </DialogHeader>
          {detalhePedido && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Badge variant="outline">{STATUS_LABELS[detalhePedido.status]}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(detalhePedido.criado_em)}</span>
              </div>

              <div className="rounded-xl bg-muted p-3">
                <p className="font-semibold text-sm">{detalhePedido.cliente_nome || 'Cliente removido'}</p>
                {detalhePedido.cliente_email && <p className="text-xs text-muted-foreground">{detalhePedido.cliente_email}</p>}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Itens</h4>
                {detalhePedido.itens?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span>{item.quantidade}x {item.produto_nome}</span>
                    <span>{formatPrice(item.preco_unitario * item.quantidade)}</span>
                  </div>
                ))}
              </div>

              {detalhePedido.observacoes && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Observações</h4>
                  <p className="text-sm text-muted-foreground">{detalhePedido.observacoes}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">{formatPrice(detalhePedido.valor_total)}</span>
              </div>

              {detalhePedido.status !== 'cancelado' && (
                <div className="flex gap-2 pt-2">
                  {NEXT_STATUS[detalhePedido.status] && (
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        changeStatus(detalhePedido.id, NEXT_STATUS[detalhePedido.status]!)
                        setDetalheDialogOpen(false)
                      }}
                    >
                      ▶ Avançar para {STATUS_LABELS[NEXT_STATUS[detalhePedido.status]!]}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      changeStatus(detalhePedido.id, 'cancelado')
                      setDetalheDialogOpen(false)
                    }}
                  >
                    ❌ Cancelar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Criar Pedido Dialog */}
      <Dialog open={criarDialogOpen} onOpenChange={setCriarDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogDescription>Selecione o cliente e adicione os produtos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Selecionar cliente */}
            <div>
              <Label>Cliente *</Label>
              {!selectedCliente ? (
                <>
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchCliente}
                    onChange={(e) => setSearchCliente(e.target.value)}
                    className="mt-1"
                  />
                  <div className="max-h-[150px] overflow-y-auto mt-2 space-y-1">
                    {filteredClientes.slice(0, 10).map((c) => (
                      <button
                        key={c.id}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                        onClick={() => {
                          setSelectedCliente(c)
                          setSearchCliente('')
                        }}
                      >
                        <span className="font-medium">{c.nome}</span>
                        <span className="text-xs text-muted-foreground ml-2">{c.email}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between mt-1 p-2 rounded-xl bg-muted">
                  <div>
                    <p className="text-sm font-medium">{selectedCliente.nome}</p>
                    <p className="text-xs text-muted-foreground">{selectedCliente.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCliente(null)}>Trocar</Button>
                </div>
              )}
            </div>

            {/* Itens */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Itens</Label>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-3 h-3 mr-1" /> Adicionar
                </Button>
              </div>
              {itens.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3">Nenhum item adicionado.</p>
              )}
              <div className="space-y-2">
                {itens.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      className="flex-1 rounded-xl border border-input bg-background px-2 py-1.5 text-sm"
                      value={item.produto_id}
                      onChange={(e) => updateItem(i, 'produto_id', Number(e.target.value))}
                    >
                      <option value={0}>Selecione...</option>
                      {produtos.filter((p) => p.preco > 0).map((p) => (
                        <option key={p.id} value={p.id}>{p.nome} — {formatPrice(p.preco)}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => updateItem(i, 'quantidade', Math.max(1, Number(e.target.value) || 1))}
                      className="w-16 text-center"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(i)}>
                      <Minus className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total estimado */}
            {itens.length > 0 && (
              <div className="text-right text-sm">
                Total estimado: <span className="font-bold">{formatPrice(calcularTotalItens())}</span>
              </div>
            )}

            {/* Observações */}
            <div>
              <Label htmlFor="pedido-obs">Observações</Label>
              <Input
                id="pedido-obs"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Detalhes adicionais..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCriarDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleCriar}
              disabled={criando || !selectedCliente || itens.length === 0 || itens.some((i) => i.produto_id === 0)}
            >
              {criando ? 'Criando...' : 'Criar Pedido'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
