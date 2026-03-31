'use client'

import { useState, FormEvent } from 'react'

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
      <div className="admin-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-icon">🔒</div>
            <h1 className="admin-login-title">Painel Admin</h1>
            <p className="admin-login-subtitle">
              Infanto Modas — Acesso restrito
            </p>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label htmlFor="admin-senha">Senha de acesso</label>
                <input
                  id="admin-senha"
                  type="password"
                  placeholder="Digite a senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary cadastro-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Entrando...
                  </>
                ) : (
                  <>🔑 Entrar</>
                )}
              </button>

              {loginError && (
                <div className="cadastro-message msg-error">
                  ⚠️ {loginError}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  // ─── DASHBOARD ───
  return (
    <div className="admin-page">
      <div className="admin-dashboard">
        {/* Top bar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <a href="/" className="admin-back-link">← Voltar ao site</a>
            <h1 className="admin-topbar-title">📋 Clientes Cadastrados</h1>
          </div>
          <div className="admin-topbar-right">
            <button onClick={() => fetchClientes(token)} className="btn btn-secondary admin-btn-refresh" disabled={loading}>
              {loading ? '⏳' : '🔄'} Atualizar
            </button>
            <button onClick={handleLogout} className="btn btn-outline admin-btn-logout">
              🚪 Sair
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-info">
              <span className="stat-number">{clientes.length}</span>
              <span className="stat-label">Total de clientes</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">💌</span>
            <div className="stat-info">
              <span className="stat-number">{totalNewsletter}</span>
              <span className="stat-label">Newsletter ativa</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="stat-icon">📅</span>
            <div className="stat-info">
              <span className="stat-number">
                {clientes.length > 0 ? formatDate(clientes[0].criado_em).split(',')[0] : '—'}
              </span>
              <span className="stat-label">Último cadastro</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="admin-search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        {/* Table */}
        <div className="admin-table-wrapper">
          {loading ? (
            <div className="admin-loading">
              <span className="spinner" /> Carregando clientes...
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              {searchTerm ? '🔍 Nenhum resultado encontrado.' : '📭 Nenhum cliente cadastrado ainda.'}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Newsletter</th>
                  <th>Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id}>
                    <td className="td-id">{i + 1}</td>
                    <td className="td-nome">{c.nome}</td>
                    <td className="td-email">{c.email}</td>
                    <td className="td-tel">{formatPhone(c.telefone)}</td>
                    <td className="td-news">
                      <span className={`badge-news ${c.aceita_newsletter ? 'active' : 'inactive'}`}>
                        {c.aceita_newsletter ? '✅ Sim' : '❌ Não'}
                      </span>
                    </td>
                    <td className="td-date">{formatDate(c.criado_em)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-footer-info">
          Mostrando {filtered.length} de {clientes.length} clientes
        </div>
      </div>
    </div>
  )
}
