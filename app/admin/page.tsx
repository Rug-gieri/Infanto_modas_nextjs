'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string | null
  aceita_newsletter: boolean
  criado_em: string
}

export default function AdminPage() {
  const [senha, setSenha] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLoginError(data.error || 'Erro ao autenticar.')
        setLoading(false)
        return
      }

      setToken(data.token)
      await fetchClientes(data.token)
    } catch {
      setLoginError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchClientes(authToken: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/clientes', {
        headers: { 'x-admin-token': authToken },
      })
      const data = await res.json()
      if (res.ok) {
        setClientes(data.clientes)
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setToken(null)
    setClientes([])
    setSenha('')
    setSearchTerm('')
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

  const totalNewsletter = clientes.filter((c) => c.aceita_newsletter).length

  // ─── LOGIN SCREEN ───
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-lg p-0">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">Painel Admin</h1>
              <p className="text-sm text-muted-foreground">Infanto Modas — Acesso restrito</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-senha" className="text-sm font-semibold text-foreground block mb-1.5">
                  Senha de acesso
                </label>
                <Input
                  id="admin-senha"
                  type="password"
                  placeholder="Digite a senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>🔑 Entrar</>
                )}
              </Button>

              {loginError && (
                <div className="mt-4 py-3 px-4 rounded-2xl text-sm font-semibold text-center bg-destructive/10 text-destructive border border-destructive/30 animate-fade-slide-up">
                  ⚠️ {loginError}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── DASHBOARD ───
  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-auto py-8 px-4 animate-fade-slide-up">
        {/* Top bar */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground no-underline transition-colors">
              ← Voltar ao site
            </a>
            <h1 className="font-display text-xl font-bold text-foreground">📋 Clientes Cadastrados</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchClientes(token)}
              disabled={loading}
            >
              {loading ? '⏳' : '🔄'} Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              🚪 Sair
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow p-0">
            <CardContent className="p-5 flex items-center gap-4">
              <span className="text-3xl">👥</span>
              <div>
                <div className="text-2xl font-bold text-foreground">{clientes.length}</div>
                <div className="text-xs text-muted-foreground">Total de clientes</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow p-0">
            <CardContent className="p-5 flex items-center gap-4">
              <span className="text-3xl">💌</span>
              <div>
                <div className="text-2xl font-bold text-foreground">{totalNewsletter}</div>
                <div className="text-xs text-muted-foreground">Newsletter ativa</div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border shadow-sm hover:shadow-md transition-shadow p-0">
            <CardContent className="p-5 flex items-center gap-4">
              <span className="text-3xl">📅</span>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {clientes.length > 0 ? formatDate(clientes[0].criado_em).split(',')[0] : '—'}
                </div>
                <div className="text-xs text-muted-foreground">Último cadastro</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
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

        {/* Table */}
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
                  <TableHead>#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Newsletter</TableHead>
                  <TableHead>Cadastrado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c, i) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell className="text-sm">{c.email}</TableCell>
                    <TableCell className="text-sm">{formatPhone(c.telefone)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={c.aceita_newsletter ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {c.aceita_newsletter ? '✅ Sim' : '❌ Não'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(c.criado_em)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  )
}
