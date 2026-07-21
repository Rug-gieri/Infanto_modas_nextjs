'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from './cart/CartProvider'
import { formatCurrency, normalizeProduto, type Produto } from '@/app/lib/shop'

const WHATSAPP = '556992228016'

interface ProdutosResponseItem extends Omit<Produto, 'preco'> {
  preco: number | string
}

export default function Destaques() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loadingProdutos, setLoadingProdutos] = useState(true)
  const [error, setError] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    fetch('/api/produtos?ativos=true')
      .then(async (res) => {
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Erro ao carregar produtos em destaque.')
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
      .catch((err: Error) => {
        setError(err.message || 'Erro ao carregar produtos em destaque.')
      })
      .finally(() => setLoadingProdutos(false))
  }, [])

  const destaques = produtos.filter((p) => p.badge).slice(0, 4)

  const bgColors = [
    'linear-gradient(135deg,#FDE8EE,#F7C5D3)',
    'linear-gradient(135deg,#E4F5F0,#C8EDE3)',
    'linear-gradient(135deg,#FDF8F3,#F0E4E8)',
    'linear-gradient(135deg,#FDE8EE,#E8D5F5)',
  ]

  return (
    <section id="destaques" className="max-w-[1200px] mx-auto px-5 sm:px-8 md:mb-10">
      <div className="text-center mb-6 sm:mb-12">
        <span className="inline-block text-rose-deep font-bold text-xs uppercase tracking-[0.15em] mb-2 sm:mb-3">Peças em destaque</span>
        <h2 className="font-body text-[clamp(1.6rem,4vw,2.8rem)] font-semibold mb-2 sm:mb-3 tracking-tighter">As queridinhas do momento</h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
          Peças selecionadas com muito carinho que estão fazendo sucesso com
          os pequenos.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3 sm:gap-6">
        {loadingProdutos ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border border-brand-border rounded-2xl sm:rounded-2xl bg-white shadow-sm p-0">
              <Skeleton className="h-40 sm:h-56 w-full rounded-none" />
              <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm font-semibold text-destructive">
            {error}
          </div>
        ) : destaques.length === 0 ? (
          <p className="text-center text-muted-foreground col-span-full py-8">
            Nenhum produto em destaque no momento. Para aparecer aqui, o produto precisa estar ativo e com badge preenchido.
          </p>
        ) : (
          destaques.map((produto, i) => (
            <Card key={produto.id} className="group overflow-hidden border border-brand-border rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 p-0">
              <div
                className="relative h-40 sm:h-56 overflow-hidden flex items-center justify-center"
                style={{ background: bgColors[i % bgColors.length] }}
              >
                <Image
                  src={produto.imagem_url}
                  alt={produto.nome}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-rose-deep text-white hover:bg-rose-deep text-[10px] sm:text-xs">
                  {produto.badge}
                </Badge>
              </div>
              <CardContent className="p-3 sm:p-5">
                <div className="font-body font-semibold text-foreground text-sm sm:text-lg mb-0.5 sm:mb-1 leading-snug">
                  {produto.nome}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  {produto.faixa_etaria || 'Todas as idades'}
                </div>
                <div className="space-y-3">
                  <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    {produto.preco > 0 ? formatCurrency(produto.preco) : 'Consulte valor'}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
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
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${produto.nome} 💗`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" variant="default" className="w-full bg-green-500 hover:bg-green-600 text-xs">
                        WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/produtos">
          <Button variant="outline" size="lg">Ver todos os produtos</Button>
        </Link>
      </div>
    </section>
  )
}
