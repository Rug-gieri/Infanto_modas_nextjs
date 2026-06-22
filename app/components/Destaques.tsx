'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const WHATSAPP = '5569992327118'

interface Produto {
    id: number
    nome: string
    descricao: string | null
    preco: number
    categoria: string
    faixa_etaria: string | null
    imagem_url: string
    badge: string | null
    ativo: boolean
    criado_em: string
}

const highlights = [
    {
        image: '/conjunto_feminino_pink.jpg',
        badge: 'Novo',
        name: 'Conjunto Feminino Pink',
        age: 'Para 2 a 6 anos',
        bg: 'linear-gradient(135deg,#FDE8EE,#F7C5D3)',
    },
    {
        image: '/conjunto_menino_blue.jpg',
        badge: 'Mais vendido',
        name: 'Conjunto Menino Azul',
        age: 'Para 0 a 18 meses',
        bg: 'linear-gradient(135deg,#E4F5F0,#C8EDE3)',
    },
    {
        image: '/trico_beje.jpg',
        badge: 'Destaque',
        name: 'Tricô Beje',
        age: 'Para 0 a 12 meses',
        bg: 'linear-gradient(135deg,#FDF8F3,#F0E4E8)',
    },
    {
        image: '/trico_red.jpg',
        badge: 'Festa',
        name: 'Tricô Vermelho',
        age: 'Para 4 a 10 anos',
        bg: 'linear-gradient(135deg,#FDE8EE,#E8D5F5)',
    },
]

export default function Destaques() {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [loadingProdutos, setLoadingProdutos] = useState(true)

    useEffect(() => {
        fetch('/api/produtos?ativos=true')
            .then((res) => res.json())
            .then((data) => {
                if (data.produtos) {
                    setProdutos(data.produtos)
                }
            })
            .catch(() => {
                // fallback to hardcoded data on error
            })
            .finally(() => setLoadingProdutos(false))
    }, [])

    const destaques = produtos.length > 0
        ? produtos.filter((p) => p.badge).slice(0, 4)
        : highlights

    const bgColors = [
        'linear-gradient(135deg,#FDE8EE,#F7C5D3)',
        'linear-gradient(135deg,#E4F5F0,#C8EDE3)',
        'linear-gradient(135deg,#FDF8F3,#F0E4E8)',
        'linear-gradient(135deg,#FDE8EE,#E8D5F5)',
    ]
    return (
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:mb-10">
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
                ) : destaques.length === 0 ? (
                    <p className="text-center text-muted-foreground col-span-full py-8">Nenhum produto em destaque no momento.</p>
                ) : (
                    destaques.map((p, i) => (
                        <Card key={'image' in p ? (p as typeof highlights[0]).name : (p as Produto).id} className="group overflow-hidden border border-brand-border rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 p-0">
                            <div
                                className="relative h-40 sm:h-56 overflow-hidden flex items-center justify-center"
                                style={{ background: bgColors[i % bgColors.length] }}
                            >
                                <Image
                                    src={'image' in p ? (p as typeof highlights[0]).image : (p as Produto).imagem_url}
                                    alt={'image' in p ? (p as typeof highlights[0]).name : (p as Produto).nome}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-rose-deep text-white hover:bg-rose-deep text-[10px] sm:text-xs">
                                    {'badge' in p ? (p as typeof highlights[0]).badge : (p as Produto).badge}
                                </Badge>
                            </div>
                            <CardContent className="p-3 sm:p-5">
                                <div className="font-body font-semibold text-foreground text-sm sm:text-lg mb-0.5 sm:mb-1 leading-snug">
                                    {'name' in p ? (p as typeof highlights[0]).name : (p as Produto).nome}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                    {'age' in p
                                        ? (p as typeof highlights[0]).age
                                        : (p as Produto).faixa_etaria || 'Todas as idades'}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                        {'preco' in p && (p as Produto).preco
                                            ? `R$ ${(p as Produto).preco.toFixed(2).replace('.', ',')}`
                                            : 'Consulte valor 💬'}
                                    </span>
                                    <a
                                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${'name' in p ? (p as typeof highlights[0]).name : (p as Produto).nome} 💗`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600 text-xs h-8 px-3 sm:px-4">
                                            💬 Pedir
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}