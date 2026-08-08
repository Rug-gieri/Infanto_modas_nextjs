'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/http/client'
import { getAdminSession, loginAdmin } from '@/lib/services/auth'

export default function AdminLogin() {
  const router = useRouter()
  const [senha, setSenha] = useState('')
  const [sessionLoading, setSessionLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    getAdminSession()
      .then((session) => {
        if (session.authenticated) {
          router.replace('/admin/dashboard')
        }
      })
      .catch(() => undefined)
      .finally(() => setSessionLoading(false))
  }, [router])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setLoginError('')

    try {
      await loginAdmin(senha)
      router.replace('/admin/dashboard')
      router.refresh()
    } catch (error) {
      setLoginError(getErrorMessage(error, 'Erro ao autenticar.'))
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center p-4 text-sm text-muted-foreground">Carregando sessao...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-lg p-0">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔒</div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">Painel Admin</h1>
            <p className="text-sm text-muted-foreground">Infanto Modas - Acesso restrito</p>
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

            <Button type="submit" className="w-full" disabled={loading} size="lg">
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
