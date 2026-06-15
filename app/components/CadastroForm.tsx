'use client'

import { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function CadastroForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone: telefone.replace(/\D/g, ''),
          aceita_newsletter: newsletter,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Erro ao cadastrar.')
        return
      }

      setStatus('success')
      setMessage(data.message || 'Cadastro realizado!')
      setNome('')
      setEmail('')
      setTelefone('')
      setNewsletter(true)
    } catch {
      setStatus('error')
      setMessage('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <section id="cadastro" className="relative overflow-hidden py-14 px-4 sm:py-20 sm:px-8 bg-gradient-to-br from-mint-light via-cream to-rose-light">
      {/* Decorative blobs */}
      <div className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(242,167,184,0.2)_0%,transparent_70%)] animate-float" />
      <div className="absolute -bottom-[80px] -right-[60px] w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(168,216,200,0.25)_0%,transparent_70%)] animate-float-reverse" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-rose-deep font-bold text-[0.7rem] sm:text-xs uppercase tracking-[0.15em] mb-3">Fique por dentro</span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-3 leading-tight">Cadastre-se e receba novidades 💌</h2>
          <p className="text-muted-foreground max-w-[520px] mx-auto">
            Seja a primeira a saber das promoções, lançamentos e dicas de moda
            infantil. O cadastro é rápido e gratuito!
          </p>
        </div>

        <form
          className="relative z-10 max-w-[520px] mx-auto bg-white/85 backdrop-blur-xl border border-brand-border/80 rounded-[28px] p-10 shadow-lg shadow-rose/15 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose/20"
          onSubmit={handleSubmit}
          id="cadastro-form"
        >
          {/* Decorative corner elements */}
          <div className="absolute -top-5 -left-5 w-[60px] h-[60px] rounded-full bg-rose opacity-15 pointer-events-none" />
          <div className="absolute -bottom-5 -right-5 w-[60px] h-[60px] rounded-full bg-mint opacity-15 pointer-events-none" />

          <div className="space-y-6">
            <div>
              <Label htmlFor="cadastro-nome" className="text-sm text-foreground">
                👤 Nome completo
              </Label>
              <Input
                id="cadastro-nome"
                type="text"
                placeholder="Ex: Maria Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="cadastro-email" className="text-sm text-foreground">
                ✉️ E-mail
              </Label>
              <Input
                id="cadastro-email"
                type="email"
                placeholder="Ex: maria@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={150}
                autoComplete="email"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="cadastro-telefone" className="text-sm text-foreground">
                📱 Telefone{' '}
                <span className="font-normal text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="cadastro-telefone"
                type="tel"
                placeholder="(69) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                autoComplete="tel"
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                id="cadastro-newsletter"
                checked={newsletter}
                onCheckedChange={(checked) => setNewsletter(!!checked)}
              />
              <Label
                htmlFor="cadastro-newsletter"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Quero receber novidades e promoções por e-mail 💌
              </Label>
            </div>

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full justify-center h-auto min-h-12 py-3.5 text-base"
              size="lg"
            >
              {status === 'loading' ? (
                <>
                  <span className="inline-block w-[18px] h-[18px] border-[2.5px] border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>✨ Cadastrar</>
              )}
            </Button>
          </div>

          {message && (
            <div
              className={cn(
                'mt-5 py-3.5 px-4 rounded-2xl text-sm font-semibold text-center animate-fade-slide-up',
                status === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-rose-light text-red-800 border border-red-200'
              )}
            >
              {status === 'success' ? '🎉' : '⚠️'} {message}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
