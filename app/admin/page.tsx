'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import AdminSidebar from '../components/AdminSidebar'
import AdminDashboard from '../components/AdminDashboard'
import AdminClientes from '../components/AdminClientes'
import AdminProdutos from '../components/AdminProdutos'
import AdminPedidos from '../components/AdminPedidos'

export default function AdminPage() {
  const [senha, setSenha] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

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

      localStorage.setItem('admin_token', data.token)
      setToken(data.token)
    } catch {
      setLoginError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token')
    setToken(null)
    setSenha('')
  }

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
                  '🔑 Entrar'
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

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="flex-1 md:pt-0 pt-14">
        {activeSection === 'dashboard' && <AdminDashboard />}
        {activeSection === 'clientes' && <AdminClientes />}
        {activeSection === 'produtos' && <AdminProdutos />}
        {activeSection === 'pedidos' && <AdminPedidos />}
      </main>
    </div>
  )
}
