'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/app/components/cart/CartProvider'
import { formatCurrency, normalizeProduto, type Produto } from '@/app/lib/shop'

type ProdutosResponseItem = Omit<Produto, 'preco'> & { preco: number | string }

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    fetch('/api/produtos?ativos=true')
      .then(async (res) => {
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao carregar produtos.')
        }

        return data
      })
      .then((data) => {
        setProdutos(
          Array.isArray(data.produtos)
            ? data.produtos.map((produto: ProdutosResponseItem) => normalizeProduto(produto))
            : []
        )
      })
      .catch((err: Error) => setError(err.message || 'Erro ao carregar produtos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-cream px-4 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 text-center sm:mb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.15em] text-rose-deep">
            Catalogo
          </span>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] text-foreground">
            Produtos da loja
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-muted-foreground">
            Monte seu carrinho e finalize seu pedido com endereco e pagamento por PIX.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] sm:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border border-brand-border bg-white p-0 shadow-sm">
                <Skeleton className="h-44 w-full rounded-none sm:h-60" />
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm font-semibold text-destructive">
              {error}
            </div>
          ) : produtos.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-brand-border bg-white px-4 py-10 text-center text-muted-foreground">
              Nenhum produto disponivel no momento.
            </div>
          ) : (
            produtos.map((produto) => (
              <Card key={produto.id} className="overflow-hidden border border-brand-border bg-white p-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-44 bg-[#f6f0f2] sm:h-60">
                  <Image src={produto.imagem_url} alt={produto.nome} fill className="object-cover" />
                  {produto.badge ? (
                    <Badge className="absolute left-3 top-3 bg-rose-deep text-white hover:bg-rose-deep">
                      {produto.badge}
                    </Badge>
                  ) : null}
                </div>
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-1 text-sm font-semibold text-foreground sm:text-lg">{produto.nome}</div>
                  <div className="mb-2 text-xs text-muted-foreground sm:text-sm">
                    {produto.faixa_etaria || 'Todas as idades'}
                  </div>
                  {produto.descricao ? (
                    <p className="mb-4 line-clamp-3 text-xs text-muted-foreground sm:text-sm">
                      {produto.descricao}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      {formatCurrency(produto.preco)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        addItem({
                          produto_id: produto.id,
                          nome: produto.nome,
                          preco: produto.preco,
                          imagem_url: produto.imagem_url,
                          faixa_etaria: produto.faixa_etaria,
                        })
                      }
                    >
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
