'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '@/app/components/cart/CartProvider'
import { formatCurrency } from '@/app/lib/shop'

export default function CarrinhoPage() {
  const { items, subtotal, updateQuantity, removeItem, isReady } = useCart()

  return (
    <section className="bg-cream px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center sm:mb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.15em] text-rose-deep">
            Carrinho
          </span>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-foreground">
            Revise seus produtos
          </h1>
        </div>

        {!isReady ? (
          <Card className="border border-brand-border bg-white p-0">
            <CardContent className="p-6 text-center text-muted-foreground">Carregando carrinho...</CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card className="border border-brand-border bg-white p-0">
            <CardContent className="p-8 text-center">
              <p className="mb-5 text-muted-foreground">Seu carrinho esta vazio.</p>
              <Link href="/produtos">
                <Button>Ver produtos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.produto_id} className="border border-brand-border bg-white p-0">
                  <CardContent className="flex gap-4 p-4 sm:p-5">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted">
                      <Image src={item.imagem_url} alt={item.nome} fill className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-foreground">{item.nome}</h2>
                        <p className="text-sm text-muted-foreground">{item.faixa_etaria || 'Todas as idades'}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.preco)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.produto_id, item.quantidade - 1)}>
                            -
                          </Button>
                          <span className="min-w-8 text-center text-sm font-semibold">{item.quantidade}</span>
                          <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.produto_id, item.quantidade + 1)}>
                            +
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeItem(item.produto_id)}>
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit border border-brand-border bg-white p-0">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground">Resumo</h2>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  O frete e o envio do comprovante do PIX serao alinhados apos o pedido.
                </p>
                <div className="mt-6 space-y-3">
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="lg">Ir para checkout</Button>
                  </Link>
                  <Link href="/produtos" className="block">
                    <Button variant="outline" className="w-full" size="lg">Continuar comprando</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
