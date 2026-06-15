'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Trash2, FileText, Download } from 'lucide-react'

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string | null
  aceita_newsletter: boolean
  criado_em: string
}

interface Pedido {
  id: number
  cliente_id: number
  status: string
  valor_total: number
  observacoes: string | null
  criado_em: string
  itens: { produto_nome: string; quantidade: number; preco_unitario: number }[]
}

const STATUS_LABELS: Record<string, string> = {
  pendente: '⏳ Pendente',
  confirmado: '✅ Confirmado',
  enviado: '📦 Enviado',
  entregue: '🏠 Entregue',
  cancelado: '❌ Cancelado',
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editTelefone, setEditTelefone] = useState('')
  const [editNewsletter, setEditNewsletter] = useState(false)
  const [saving, setSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null)

  const [pedidosDialogOpen, setPedidosDialogOpen] = useState(false)
  const [pedidosClienteNome, setPedidosClienteNome] = useState('')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pedidosLoading, setPedidosLoading] = useState(false)

  useEffect(() => {
    fetchClientes()
  }, [])

  function getToken() {
    return localStorage.getItem('admin_token') || ''
  }

  async function fetchClientes() {
    setLoading(true)
    try {
      const res = await fetch('/api/clientes', {
        headers: { 'x-admin-token': getToken() },
      })
      const data = await res.json()
      if (res.ok) setClientes(data.clientes)
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  function openEdit(cliente: Cliente) {
    setEditingCliente(cliente)
    setEditNome(cliente.nome)
    setEditEmail(cliente.email)
    setEditTelefone(cliente.telefone || '')
    setEditNewsletter(cliente.aceita_newsletter)
    setEditDialogOpen(true)
  }

  async function handleSaveEdit() {
    if (!editingCliente) return
    setSaving(true)
    try {
      const res = await fetch('/api/clientes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getToken(),
        },
        body: JSON.stringify({
          id: editingCliente.id,
          nome: editNome,
          email: editEmail,
          telefone: editTelefone || null,
          aceita_newsletter: editNewsletter,
        }),
      })
      if (res.ok) {
        setEditDialogOpen(false)
        fetchClientes()
      }
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err)
    } finally {
      setSaving(false)
    }
  }

  function openDelete(cliente: Cliente) {
    setDeletingCliente(cliente)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deletingCliente) return
    try {
      const res = await fetch('/api/clientes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getToken(),
        },
        body: JSON.stringify({ id: deletingCliente.id }),
      })
      if (res.ok) {
        setDeleteDialogOpen(false)
        fetchClientes()
      }
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
    }
  }

  async function openPedidos(cliente: Cliente) {
    setPedidosClienteNome(cliente.nome)
    setPedidosDialogOpen(true)
    setPedidosLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        headers: { 'x-admin-token': getToken() },
      })
      const data = await res.json()
      if (res.ok) {
        setPedidos(
          (data.pedidos || []).filter((p: Pedido) => p.cliente_id === cliente.id)
        )
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setPedidosLoading(false)
    }
  }

  function handleExportCSV() {
    const rows = filtered.map((c) =>
      [
        c.nome,
        c.email,
        formatPhone(c.telefone),
        c.aceita_newsletter ? 'Sim' : 'Não',
        formatDate(c.criado_em),
      ].join(',')
    )
    const csv = ['Nome,Email,Telefone,Newsletter,Cadastrado em', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'clientes_infanto_modas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatPhone(phone: string | null) {
    if (!phone) return '—'
    const d = phone.replace(/\D/g, '')
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return phone
  }

  const filtered = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Clientes</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={fetchClientes} disabled={loading}>
            {loading ? '⏳' : '🔄'} Atualizar
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        <Input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer text-sm"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>

      <Card className="rounded-2xl border-border overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-primary/30 border-t-primary rounded-full animate-spin mr-2 align-middle" />
            Carregando clientes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {searchTerm ? '🔍 Nenhum resultado encontrado.' : '📭 Nenhum cliente cadastrado ainda.'}
          </div>
        ) : (
          <Table>
            <TableCaption className="pb-4">
              Mostrando {filtered.length} de {clientes.length} clientes
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Newsletter</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell className="text-sm">{c.email}</TableCell>
                  <TableCell className="text-sm">{formatPhone(c.telefone)}</TableCell>
                  <TableCell>
                    <Badge variant={c.aceita_newsletter ? 'default' : 'secondary'} className="text-xs">
                      {c.aceita_newsletter ? '✅ Sim' : '❌ Não'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(c.criado_em)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openPedidos(c)} title="Ver pedidos">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)} title="Editar">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(c)} title="Excluir">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Altere os dados do cliente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-nome">Nome</Label>
              <Input id="edit-nome" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-email">E-mail</Label>
              <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input id="edit-telefone" value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-newsletter"
                checked={editNewsletter}
                onCheckedChange={(checked) => setEditNewsletter(checked === true)}
              />
              <Label htmlFor="edit-newsletter" className="cursor-pointer">Aceita newsletter</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Cliente</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{deletingCliente?.nome}</strong>? Pedidos associados serão preservados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pedidos Dialog */}
      <Dialog open={pedidosDialogOpen} onOpenChange={setPedidosDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedidos de {pedidosClienteNome}</DialogTitle>
          </DialogHeader>
          {pedidosLoading ? (
            <div className="p-6 text-center text-muted-foreground">Carregando...</div>
          ) : pedidos.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">Nenhum pedido encontrado.</div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {pedidos.map((p) => (
                <Card key={p.id} className="rounded-xl border-border p-0">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">Pedido #{p.id}</span>
                      <Badge variant="outline" className="text-xs">{STATUS_LABELS[p.status] || p.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {p.itens?.map((item, i) => (
                        <div key={i}>{item.quantidade}x {item.produto_nome} — R$ {item.preco_unitario.toFixed(2).replace('.', ',')}</div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{formatDate(p.criado_em)}</span>
                      <span className="font-semibold">R$ {p.valor_total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
