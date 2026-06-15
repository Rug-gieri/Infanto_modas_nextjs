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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface Produto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  categoria: string
  faixa_etaria: string | null
  imagem_url: string
  badge: string | null
  ativo: boolean
  criado_em: string
}

const CATEGORIAS = ['feminino', 'masculino', 'bebe', 'acessorios']
const BADGES = ['', 'Novo', 'Mais vendido', 'Destaque', 'Festa']

const emptyProduto = {
  nome: '',
  descricao: '',
  preco: 0,
  categoria: 'feminino',
  faixa_etaria: '',
  imagem_url: '',
  badge: '',
  ativo: true,
}

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyProduto })
  const [saving, setSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProduto, setDeletingProduto] = useState<Produto | null>(null)

  useEffect(() => {
    fetchProdutos()
  }, [])

  function getToken() {
    return localStorage.getItem('admin_token') || ''
  }

  async function fetchProdutos() {
    setLoading(true)
    try {
      const url = new URL('/api/produtos', window.location.origin)
      if (filtroCategoria) url.searchParams.set('categoria', filtroCategoria)
      const res = await fetch(url.toString(), {
        headers: { 'x-admin-token': getToken() },
      })
      const data = await res.json()
      if (res.ok) setProdutos(data.produtos)
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyProduto })
    setDialogOpen(true)
  }

  function openEdit(produto: Produto) {
    setEditingId(produto.id)
    setForm({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      categoria: produto.categoria,
      faixa_etaria: produto.faixa_etaria || '',
      imagem_url: produto.imagem_url,
      badge: produto.badge || '',
      ativo: produto.ativo,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.nome || !form.imagem_url || !form.categoria || form.preco <= 0) return
    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId ? { id: editingId, ...form } : form
      const res = await fetch('/api/produtos', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getToken(),
        },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setDialogOpen(false)
        fetchProdutos()
      }
    } catch (err) {
      console.error('Erro ao salvar produto:', err)
    } finally {
      setSaving(false)
    }
  }

  async function toggleAtivo(produto: Produto) {
    try {
      const res = await fetch('/api/produtos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getToken(),
        },
        body: JSON.stringify({ id: produto.id, ativo: !produto.ativo }),
      })
      if (res.ok) fetchProdutos()
    } catch (err) {
      console.error('Erro ao alternar status:', err)
    }
  }

  function openDelete(produto: Produto) {
    setDeletingProduto(produto)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deletingProduto) return
    try {
      const res = await fetch('/api/produtos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getToken(),
        },
        body: JSON.stringify({ id: deletingProduto.id }),
      })
      if (res.ok) {
        setDeleteDialogOpen(false)
        fetchProdutos()
      }
    } catch (err) {
      console.error('Erro ao excluir produto:', err)
    }
  }

  const filtered = produtos.filter((p) => {
    const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  function formatPrice(v: number) {
    return `R$ ${v.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Produtos</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchProdutos} disabled={loading}>
            {loading ? '⏳' : '🔄'} Atualizar
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1" />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
          <Input
            type="text"
            placeholder="Buscar por nome..."
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
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas categorias</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      <Card className="rounded-2xl border-border overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-primary/30 border-t-primary rounded-full animate-spin mr-2 align-middle" />
            Carregando produtos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            {searchTerm ? '🔍 Nenhum resultado encontrado.' : '📭 Nenhum produto cadastrado ainda.'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.imagem_url ? (
                      <img
                        src={p.imagem_url}
                        alt={p.nome}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-lg" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell className="text-sm capitalize">{p.categoria}</TableCell>
                  <TableCell className="text-sm font-semibold">{formatPrice(p.preco)}</TableCell>
                  <TableCell>
                    {p.badge && <Badge variant="secondary" className="text-xs">{p.badge}</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={p.ativo ? 'default' : 'outline'}
                      className="text-xs cursor-pointer"
                      onClick={() => toggleAtivo(p)}
                    >
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Editar">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(p)} title="Excluir">
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Altere os dados do produto.' : 'Preencha os dados do novo produto.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <Label htmlFor="prod-nome">Nome *</Label>
              <Input id="prod-nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="prod-desc">Descrição</Label>
              <Input id="prod-desc" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="prod-preco">Preço *</Label>
              <Input id="prod-preco" type="number" step="0.01" min="0" value={form.preco || ''} onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <Label htmlFor="prod-categoria">Categoria *</Label>
              <select
                id="prod-categoria"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="prod-idade">Faixa Etária</Label>
              <Input id="prod-idade" value={form.faixa_etaria} onChange={(e) => setForm({ ...form, faixa_etaria: e.target.value })} placeholder="Ex: 2 a 6 anos" />
            </div>
            <div>
              <Label htmlFor="prod-imagem">URL da Imagem *</Label>
              <Input id="prod-imagem" value={form.imagem_url} onChange={(e) => setForm({ ...form, imagem_url: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="prod-badge">Badge</Label>
              <select
                id="prod-badge"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>{b || 'Nenhum'}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="prod-ativo"
                checked={form.ativo}
                onCheckedChange={(checked) => setForm({ ...form, ativo: checked === true })}
              />
              <Label htmlFor="prod-ativo" className="cursor-pointer">Produto ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nome || !form.imagem_url || form.preco <= 0}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{deletingProduto?.nome}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
