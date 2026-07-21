'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/app/components/cart/CartProvider'
import { formatCep, formatCurrency, formatPhone } from '@/app/lib/shop'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'error'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart, isReady } = useCart()
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    referencia: '',
    observacoes: '',
  })

  useEffect(() => {
    if (isReady && items.length === 0) {
      router.replace('/carrinho')
    }
  }, [isReady, items.length, router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          telefone: form.telefone.replace(/\D/g, ''),
          cep: form.cep.replace(/\D/g, ''),
          estado: form.estado.toUpperCase(),
          itens: items.map((item) => ({
            produto_id: item.produto_id,
            quantidade: item.quantidade,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Nao foi possivel finalizar o pedido.')
        return
      }

      clearCart()
      router.push(`/pedido/${data.pedido.id}`)
    } catch {
      setStatus('error')
      setMessage('Erro de conexao. Tente novamente.')
    }
  }

  if (!isReady || items.length === 0) {
    return null
  }

  return (
    <section className="bg-cream px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1150px]">
        <div className="mb-8 text-center sm:mb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.15em] text-rose-deep">
            Checkout
          </span>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-foreground">
            Finalize seu pedido
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-muted-foreground">
            O pagamento desta primeira versao e por PIX manual. Depois do pedido, voce recebe as instrucoes para enviar o comprovante.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border border-brand-border bg-white p-0">
            <CardContent className="p-6 sm:p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="checkout-nome">Nome completo</Label>
                    <Input id="checkout-nome" value={form.nome} onChange={(e) => setForm((current) => ({ ...current, nome: e.target.value }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-email">E-mail</Label>
                    <Input id="checkout-email" type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-telefone">Telefone</Label>
                    <Input id="checkout-telefone" value={form.telefone} onChange={(e) => setForm((current) => ({ ...current, telefone: formatPhone(e.target.value) }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-cep">CEP</Label>
                    <Input id="checkout-cep" value={form.cep} onChange={(e) => setForm((current) => ({ ...current, cep: formatCep(e.target.value) }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-estado">Estado</Label>
                    <Input id="checkout-estado" value={form.estado} onChange={(e) => setForm((current) => ({ ...current, estado: e.target.value.slice(0, 2).toUpperCase() }))} className="mt-2" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="checkout-logradouro">Logradouro</Label>
                    <Input id="checkout-logradouro" value={form.logradouro} onChange={(e) => setForm((current) => ({ ...current, logradouro: e.target.value }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-numero">Numero</Label>
                    <Input id="checkout-numero" value={form.numero} onChange={(e) => setForm((current) => ({ ...current, numero: e.target.value }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-complemento">Complemento</Label>
                    <Input id="checkout-complemento" value={form.complemento} onChange={(e) => setForm((current) => ({ ...current, complemento: e.target.value }))} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="checkout-bairro">Bairro</Label>
                    <Input id="checkout-bairro" value={form.bairro} onChange={(e) => setForm((current) => ({ ...current, bairro: e.target.value }))} className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="checkout-cidade">Cidade</Label>
                    <Input id="checkout-cidade" value={form.cidade} onChange={(e) => setForm((current) => ({ ...current, cidade: e.target.value }))} className="mt-2" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="checkout-referencia">Referencia</Label>
                    <Input id="checkout-referencia" value={form.referencia} onChange={(e) => setForm((current) => ({ ...current, referencia: e.target.value }))} className="mt-2" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="checkout-observacoes">Observacoes</Label>
                    <textarea
                      id="checkout-observacoes"
                      value={form.observacoes}
                      onChange={(e) => setForm((current) => ({ ...current, observacoes: e.target.value }))}
                      className="mt-2 min-h-28 w-full rounded-lg border border-input bg-transparent px-3.5 py-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Ex: ponto de referencia, horario ideal para entrega, tamanho para presente..."
                    />
                  </div>
                </div>

                {message ? (
                  <div
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-sm font-medium',
                      status === 'error'
                        ? 'border-destructive/30 bg-destructive/10 text-destructive'
                        : 'border-border bg-muted text-foreground'
                    )}
                  >
                    {message}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" size="lg" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Finalizando...' : 'Finalizar pedido por PIX'}
                  </Button>
                  <Link href="/carrinho">
                    <Button type="button" variant="outline" size="lg">Voltar ao carrinho</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="h-fit border border-brand-border bg-white p-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground">Resumo do pedido</h2>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div key={item.produto_id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <div className="font-medium text-foreground">{item.nome}</div>
                      <div className="text-muted-foreground">Qtd. {item.quantidade}</div>
                    </div>
                    <div className="font-semibold text-foreground">
                      {formatCurrency(item.preco * item.quantidade)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pagamento</span>
                  <span className="font-semibold text-foreground">PIX manual</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
