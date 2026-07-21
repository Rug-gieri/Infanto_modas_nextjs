'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, type PedidoResumo } from '@/app/lib/shop'

const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || 'CHAVE_PIX_A_CONFIGURAR'
const PIX_RECEIVER = process.env.NEXT_PUBLIC_PIX_RECEIVER || 'Infanto Modas'
const WHATSAPP = '556992228016'

export default function PedidoPage() {
  const params = useParams<{ id: string }>()
  const [pedido, setPedido] = useState<PedidoResumo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/checkout/${params.id}`)
      .then(async (res) => {
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Nao foi possivel carregar o pedido.')
        }

        return data
      })
      .then((data) => setPedido(data.pedido))
      .catch((err: Error) => setError(err.message || 'Nao foi possivel carregar o pedido.'))
      .finally(() => setLoading(false))
  }, [params.id])

  return (
    <section className="bg-cream px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-8 text-center sm:mb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.15em] text-rose-deep">
            Pedido confirmado
          </span>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-foreground">
            Recebemos seu pedido
          </h1>
        </div>

        {loading ? (
          <Card className="border border-brand-border bg-white p-0">
            <CardContent className="p-6 text-center text-muted-foreground">Carregando pedido...</CardContent>
          </Card>
        ) : error || !pedido ? (
          <Card className="border border-destructive/30 bg-white p-0">
            <CardContent className="p-6 text-center text-destructive">{error || 'Pedido nao encontrado.'}</CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border border-brand-border bg-white p-0">
              <CardContent className="p-6 sm:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Numero do pedido</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">#{pedido.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor total</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{formatCurrency(Number(pedido.valor_total))}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-brand-border bg-muted/40 p-5">
                  <h2 className="text-lg font-semibold text-foreground">Como pagar no PIX</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Faça o pagamento para a chave abaixo e envie o comprovante para nossa equipe no WhatsApp junto com o numero do pedido.
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div><strong>Recebedor:</strong> {PIX_RECEIVER}</div>
                    <div><strong>Chave PIX:</strong> {PIX_KEY}</div>
                    <div><strong>Referencia:</strong> Pedido #{pedido.id}</div>
                  </div>
                  <div className="mt-5">
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Segue o comprovante do pedido #${pedido.id}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-green-500 hover:bg-green-600">Enviar comprovante no WhatsApp</Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-border bg-white p-0">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-foreground">Itens do pedido</h2>
                <div className="mt-5 space-y-4">
                  {pedido.itens.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 border-b border-border pb-4 text-sm last:border-b-0 last:pb-0">
                      <div>
                        <div className="font-medium text-foreground">{item.produto_nome}</div>
                        <div className="text-muted-foreground">Qtd. {item.quantidade}</div>
                      </div>
                      <div className="font-semibold text-foreground">
                        {formatCurrency(Number(item.preco_unitario) * item.quantidade)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-border bg-white p-0">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-foreground">Entrega</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {pedido.logradouro}, {pedido.numero}
                  {pedido.complemento ? `, ${pedido.complemento}` : ''}
                  <br />
                  {pedido.bairro} - {pedido.cidade}/{pedido.estado}
                  <br />
                  CEP {pedido.cep}
                </p>
                {pedido.referencia ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    <strong>Referencia:</strong> {pedido.referencia}
                  </p>
                ) : null}
                {pedido.observacoes ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    <strong>Observacoes:</strong> {pedido.observacoes}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Link href="/produtos">
                <Button variant="outline">Voltar aos produtos</Button>
              </Link>
              <Link href="/">
                <Button>Voltar para inicio</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
