'use client'

import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getErrorMessage } from '@/lib/http/client'
import { deleteProduto, listProdutos, saveProduto } from '@/lib/services/produtos'
import { uploadProdutoImage } from '@/lib/services/uploads'
import type { Produto, ProdutoFormValues } from '@/lib/types/admin'

const CATEGORIAS = ['feminino', 'masculino', 'bebe', 'acessorios']
const BADGES = ['', 'Novo', 'Mais vendido', 'Destaque', 'Festa']

const emptyProduto: ProdutoFormValues = {
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProduto, setDeletingProduto] = useState<Produto | null>(null)

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  useEffect(() => {
    fetchProdutos()
  }, [])

  useEffect(() => {
    fetchProdutos()
  }, [filtroCategoria])

  async function fetchProdutos() {
    setLoading(true)
    try {
      setProdutos(await listProdutos(filtroCategoria || undefined))
    } catch (err) {
      setSaveError(getErrorMessage(err, 'Erro ao buscar produtos.'))
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyProduto })
    setSelectedFile(null)
    setImagePreviewUrl('')
    setSaveError('')
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
    setSelectedFile(null)
    setImagePreviewUrl(produto.imagem_url)
    setSaveError('')
    setDialogOpen(true)
  }

  function handleDialogChange(open: boolean) {
    setDialogOpen(open)

    if (!open) {
      setSelectedFile(null)
      setSaveError('')
      setUploading(false)

      if (imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }

      setImagePreviewUrl('')
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)

    if (imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl)
    }

    setImagePreviewUrl(file ? URL.createObjectURL(file) : form.imagem_url)
  }

  function canSave() {
    return Boolean(form.nome && form.categoria && form.preco > 0 && (form.imagem_url || selectedFile))
  }

  async function handleSave() {
    if (!canSave()) return
    setSaving(true)
    setSaveError('')
    try {
      let imagemUrl = form.imagem_url

      if (selectedFile) {
        setUploading(true)
        const upload = await uploadProdutoImage(selectedFile)
        imagemUrl = upload.secure_url
      }

      await saveProduto(editingId ? { id: editingId, ...form, imagem_url: imagemUrl } : { ...form, imagem_url: imagemUrl })
      setDialogOpen(false)
      setSelectedFile(null)
      setImagePreviewUrl('')
      setFiltroCategoria('')
      fetchProdutos()
    } catch (err) {
      setSaveError(getErrorMessage(err, 'Erro ao salvar produto.'))
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  async function toggleAtivo(produto: Produto) {
    try {
      await saveProduto({ id: produto.id, ...formFromProduto(produto), ativo: !produto.ativo })
      fetchProdutos()
    } catch (err) {
      setSaveError(getErrorMessage(err, 'Erro ao alternar status do produto.'))
    }
  }

  function openDelete(produto: Produto) {
    setDeletingProduto(produto)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (!deletingProduto) return
    try {
      await deleteProduto(deletingProduto.id)
      setDeleteDialogOpen(false)
      fetchProdutos()
    } catch (err) {
      setSaveError(getErrorMessage(err, 'Erro ao excluir produto.'))
    }
  }

  const filtered = produtos.filter((p) => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  function formatPrice(v: number) {
    return `R$ ${v.toFixed(2).replace('.', ',')}`
  }

  function formFromProduto(produto: Produto): ProdutoFormValues {
    return {
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      categoria: produto.categoria,
      faixa_etaria: produto.faixa_etaria || '',
      imagem_url: produto.imagem_url,
      badge: produto.badge || '',
      ativo: produto.ativo,
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Produtos</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchProdutos} disabled={loading}>{loading ? '⏳' : '🔄'} Atualizar</Button>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4 mr-1" />Novo Produto</Button>
        </div>
      </div>

      {saveError && !dialogOpen && <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{saveError}</div>}

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
          <Input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          {searchTerm && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer text-sm" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="rounded-xl border border-input bg-background px-3 py-2 text-sm">
          <option value="">Todas categorias</option>
          {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
        </select>
      </div>

      <Card className="rounded-2xl border-border overflow-hidden p-0">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-primary/30 border-t-primary rounded-full animate-spin mr-2 align-middle" />
            Carregando produtos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">{searchTerm ? '🔍 Nenhum resultado encontrado.' : '📭 Nenhum produto cadastrado ainda.'}</div>
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
                    {p.imagem_url ? <img src={p.imagem_url} alt={p.nome} className="w-12 h-12 object-cover rounded-lg" /> : <div className="w-12 h-12 bg-muted rounded-lg" />}
                  </TableCell>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell className="text-sm capitalize">{p.categoria}</TableCell>
                  <TableCell className="text-sm font-semibold">{formatPrice(p.preco)}</TableCell>
                  <TableCell>{p.badge && <Badge variant="secondary" className="text-xs">{p.badge}</Badge>}</TableCell>
                  <TableCell>
                    <Badge variant={p.ativo ? 'default' : 'outline'} className="text-xs cursor-pointer" onClick={() => toggleAtivo(p)}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} title="Editar"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openDelete(p)} title="Excluir"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>{editingId ? 'Altere os dados do produto.' : 'Preencha os dados do novo produto.'}</DialogDescription>
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
              <Input id="prod-preco" type="text" inputMode="decimal" value={form.preco || ''} onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value.replace(',', '.')) || 0 })} />
            </div>
            <div>
              <Label htmlFor="prod-categoria">Categoria *</Label>
              <select id="prod-categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="prod-idade">Faixa Etária</Label>
              <Input id="prod-idade" value={form.faixa_etaria} onChange={(e) => setForm({ ...form, faixa_etaria: e.target.value })} placeholder="Ex: 2 a 6 anos" />
            </div>
            <div>
              <Label htmlFor="prod-imagem">Imagem *</Label>
              <Input id="prod-imagem" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
              <p className="mt-1 text-xs text-muted-foreground">Use JPG, PNG ou WEBP com ate 5 MB.</p>
              {(imagePreviewUrl || form.imagem_url) && (
                <div className="mt-3">
                  <img src={imagePreviewUrl || form.imagem_url} alt="Preview da imagem do produto" className="h-28 w-28 rounded-xl object-cover border border-border" />
                </div>
              )}
              {selectedFile && <p className="mt-2 text-xs text-muted-foreground">Arquivo selecionado: {selectedFile.name}</p>}
            </div>
            <div>
              <Label htmlFor="prod-badge">Badge</Label>
              <select id="prod-badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                {BADGES.map((b) => <option key={b} value={b}>{b || 'Nenhum'}</option>)}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">Produtos com badge preenchido podem aparecer na seccao de destaques da landing.</p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="prod-ativo" checked={form.ativo} onCheckedChange={(checked) => setForm({ ...form, ativo: checked === true })} />
              <Label htmlFor="prod-ativo" className="cursor-pointer">Produto ativo</Label>
            </div>
            <p className="text-xs text-muted-foreground">Somente produtos ativos sao expostos na API publica usada pelo site.</p>
          </div>
          <DialogFooter>
            {saveError && <p className="text-sm text-destructive font-semibold w-full">{saveError}</p>}
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={() => handleDialogChange(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving || uploading || !canSave()}>{uploading ? 'Enviando imagem...' : saving ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir <strong>{deletingProduto?.nome}</strong>?</DialogDescription>
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
