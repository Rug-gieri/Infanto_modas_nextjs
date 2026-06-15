'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import WhatsAppButton from './components/WhatsAppButton'
import Gallery from './components/Gallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
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

const ageGuide = [
  {
    tab: '0–12m',
    label: 'Bebê',
    emoji: '🍼',
    phase: 'A fase da descoberta',
    title: 'Recém-nascido a 1 ano',
    description:
      'Os primeiros meses são de adaptação ao mundo. O bebê dorme muito, fica no colo e cresce numa velocidade incrível. Nessa fase o conforto é soberano.',
    clothingWhy:
      'A pele dos bebês é extremamente sensível, e a temperatura corporal ainda é instável. Tecidos macios como algodão puro são essenciais.',
    tips: [
      'Bodies com abertura frontal ou lateral facilitam a troca sem acordar o bebê',
      'Macacões com zíper do pescoço aos pés são práticos nas madrugadas',
      'Evite elásticos apertados e costuras salientes próximas ao corpo',
      'Prefira tons neutros ou pastel em tecido 100% algodão',
      'Calcule para o bebê crescer: compre uma numeração acima',
    ],
  },
  {
    tab: '1–3 anos',
    label: 'Toddler',
    emoji: '🏃',
    phase: 'A fase da exploração',
    title: 'Primeiros passos e muita energia',
    description:
      'É a fase em que tudo vira brinquedo. O toddler dá os primeiros passos, toca em tudo e se suja constantemente — com muita alegria! A autonomia começa a surgir.',
    clothingWhy:
      'As roupas precisam acompanhar o movimento. Elásticos na cintura facilitam o desfralde, e tecidos laváveis são indispensáveis para a rotina agitada.',
    tips: [
      'Calças com elástico na cintura para facilitar o uso do banheiro',
      'Tecidos anti-alérgicos e laváveis na máquina com cores vivas',
      'Evite botões pequenos e acessórios que possam ser engolidos',
      'Tênis flexíveis e solados antiderrapantes para quem está aprendendo a andar',
      'Bom presente: conjuntinhos de 2 ou 3 peças coordenadas',
    ],
  },
  {
    tab: '4–6 anos',
    label: 'Pré-escolar',
    emoji: '🎨',
    phase: 'A fase da personalidade',
    title: 'Entrando na escola com estilo',
    description:
      'A criança já tem opiniões e começa a preferir determinadas cores e estampas. A escola entra na rotina e as roupas precisam ser versáteis para brincar e aprender.',
    clothingWhy:
      'Praticidade para a professora e liberdade de movimento são essenciais. A criança precisa ser independente para se vestir e calçar sozinha.',
    tips: [
      'Velcro nos calçados ajuda a criança a se calçar sozinha',
      'Leggings e calças de moletom são perfeitas para brincar no chão',
      'Estampas com personagens favoritos aumentam o entusiasmo para se vestir',
      'Conjuntos de 3 peças versáteis: podem ser usados separados ou juntos',
      'Presente ideal: mochila + conjunto com tema favorito da criança',
    ],
  },
  {
    tab: '7–10 anos',
    label: 'Escolar',
    emoji: '📚',
    phase: 'A fase da identidade',
    title: 'Criando o próprio estilo',
    description:
      'A criança escolar tem forte senso de identidade e quer se parecer com os amigos. As modas do grupo influenciam as escolhas. É a fase dos esportes e hobbies.',
    clothingWhy:
      'A durabilidade é fundamental — as crianças se movimentam muito. Tecidos tecnológicos (dry-fit para esporte) e looks que misturam casual e estiloso fazem sucesso.',
    tips: [
      'Camisetas gráficas com bandas, filmes ou esportes favoritos',
      'Bermudas e calças jogger são confortáveis e estilosas',
      'Tênis esportivos resistentes para as brincadeiras no recreio',
      'Mochilas e acessórios coordenados ao look fazem a diferença',
      'Conjunto de presente: look completo head to toe com o tema favorito',
    ],
  },
  {
    tab: '11–14 anos',
    label: 'Juvenil',
    emoji: '🌟',
    phase: 'A fase da transição',
    title: 'Entre criança e adolescente',
    description:
      'Uma fase delicada de transição. O pré-adolescente quer roupas que expressem sua personalidade única, fugindo do infantil sem entrar no adulto. A moda importa muito!',
    clothingWhy:
      'A roupa é expressão de identidade nessa fase. Peças com qualidade, cortes modernos e que respeitem a faixa etária são as mais aceitas.',
    tips: [
      'Básicos de qualidade: camisetas, jeans e hoodies que combinam com tudo',
      'Streetwear leve: peças inspiradas em street style mas adequadas para a idade',
      'Tecidos de qualidade que aguentam lavagens frequentes',
      'Kits de presente: conjuntos curados com a personalidade da criança',
      'Sempre consulte a criança — a autonomia de escolha é muito valorizada',
    ],
  },
]

export default function Home() {
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
    <>
      {/* ── HERO ── */}
      <section
        data-search-root
        id="inicio"
        className="relative flex items-center sm:min-h-[88vh] overflow-hidden py-10 px-4 sm:py-16 sm:px-8 bg-gradient-to-br from-rose-light via-mint-light to-cream"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-[60px] -right-[60px] w-[220px] h-[220px] md:w-[380px] md:h-[380px] rounded-full bg-[radial-gradient(circle,rgba(242,167,184,0.35)_0%,transparent_70%)] animate-float" />
        <div className="absolute -bottom-[80px] -left-[40px] w-[180px] h-[180px] md:w-[300px] md:h-[300px] rounded-full bg-[radial-gradient(circle,rgba(168,216,200,0.4)_0%,transparent_70%)] animate-float-reverse" />

        <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white border border-rose text-rose-deep text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-md shadow-rose/20 animate-fade-slide-up">
              <span>🌸</span> Porque seu filho merece o melhor!
            </div>
            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] leading-tight text-foreground mb-5 animate-fade-slide-up [animation-delay:0.1s]">
              Roupinhas que contam{' '}
              <em className="italic text-rose-deep not-italic">histórias de infância</em>
            </h1>
            <p className="text-[1.05rem] text-muted-foreground mb-8 max-w-[420px] animate-fade-slide-up [animation-delay:0.2s] mx-auto md:mx-0">
              De 0 a 16 anos, cada peça é escolhida com carinho para vestir os
              pequenos com conforto, qualidade e muito estilo. Compre pelo
              WhatsApp e receba em casa! 💗
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start animate-fade-slide-up [animation-delay:0.3s]">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de ver as roupinhas 💗')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="w-full sm:w-auto bg-green-500 hover:bg-green-600">
                  💬 Comprar agora
                </Button>
              </a>
              <a href="#destaques" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full">Ver destaques ↓</Button>
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center animate-fade-slide-up [animation-delay:0.2s] order-first md:order-none">
            <div className="relative">
              {/* Floating pills */}
              <div className="hidden sm:flex absolute top-[10%] md:-right-[10%] right-[-5%] z-10 bg-white rounded-full px-4 py-2 shadow-lg text-xs font-bold text-rose-deep items-center gap-1.5 animate-float whitespace-nowrap">
                ⭐ +500 famílias
              </div>
              <div className="hidden sm:flex absolute bottom-[15%] md:-left-[5%] left-[-5%] z-10 bg-white rounded-full px-4 py-2 shadow-lg text-xs font-bold text-mint items-center gap-1.5 animate-float [animation-delay:2s] whitespace-nowrap">
                🚚 Entrega em casa
              </div>

              {/* Blob image frame */}
              <div className="w-[220px] h-[240px] sm:w-[280px] sm:h-[300px] md:w-[400px] md:h-[450px] bg-white rounded-[40%_60%_60%_40%_/_50%_40%_60%_50%] flex items-center justify-center shadow-xl shadow-rose/30 border-[3px] border-rose/30 overflow-hidden animate-morph-blob">
                <Image
                  className="object-cover"
                  src="/main_img.jpg"
                  alt="mãe vestindo o filho"
                  width={430}
                  height={450}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTAQUES ── */}
      <section id="destaques" className="py-14 px-4 sm:py-20 sm:px-8 bg-cream">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-rose-deep font-bold text-xs uppercase tracking-[0.15em] mb-3">Peças em destaque</span>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-3 leading-tight">As queridinhas do momento ✨</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Peças selecionadas com muito carinho que estão fazendo sucesso com
              os pequenos.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
            {loadingProdutos ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border border-brand-border rounded-2xl bg-white shadow-sm p-0">
                  <Skeleton className="h-56 w-full rounded-none" />
                  <CardContent className="p-5 space-y-3">
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
                    className="relative h-56 overflow-hidden flex items-center justify-center"
                    style={{ background: bgColors[i % bgColors.length] }}
                  >
                    <Image
                      src={'image' in p ? (p as typeof highlights[0]).image : (p as Produto).imagem_url}
                      alt={'image' in p ? (p as typeof highlights[0]).name : (p as Produto).nome}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 z-10 bg-rose-deep text-white hover:bg-rose-deep">
                      {'badge' in p ? (p as typeof highlights[0]).badge : (p as Produto).badge}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="font-display font-semibold text-foreground text-lg mb-1">
                      {'name' in p ? (p as typeof highlights[0]).name : (p as Produto).nome}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      {'age' in p
                        ? (p as typeof highlights[0]).age
                        : (p as Produto).faixa_etaria || 'Todas as idades'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {'preco' in p && (p as Produto).preco
                          ? `R$ ${(p as Produto).preco.toFixed(2).replace('.', ',')}`
                          : 'Consulte valor 💬'}
                      </span>
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${'name' in p ? (p as typeof highlights[0]).name : (p as Produto).nome} 💗`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="default" className="bg-green-500 hover:bg-green-600">
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
      </section>

      {/* ── GUIA POR IDADE ── */}
      <section id="por-idade" className="py-14 px-4 sm:py-20 sm:px-8 bg-warm-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-rose-deep font-bold text-xs uppercase tracking-[0.15em] mb-3">Guia de presente por idade</span>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-3 leading-tight">O que dar de presente? 🎁</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Cada fase da infância tem suas necessidades e encantamentos únicos.
              Escolha o presente ideal para cada idade.
            </p>
          </div>

          <Tabs defaultValue="0" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-10 bg-transparent h-auto">
              {ageGuide.map((a, i) => (
                <TabsTrigger
                  key={i}
                  value={String(i)}
                  className="data-[state=active]:bg-rose-deep data-[state=active]:text-white text-muted-foreground border border-brand-border rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:text-rose-deep"
                >
                  {a.tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {ageGuide.map((a, i) => (
              <TabsContent key={i} value={String(i)} className="animate-fade-slide-up">
                <Card className="border-brand-border bg-white rounded-2xl p-0">
                  <CardContent className="p-8 grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
                    <div className="text-6xl md:text-7xl flex-shrink-0 text-center">{a.emoji}</div>
                    <div>
                      <span className="inline-block text-rose-deep font-semibold text-sm mb-2">
                        {a.label} · {a.phase}
                      </span>
                      <h3 className="font-display text-2xl text-foreground mb-4">{a.title}</h3>
                      <p className="text-muted-foreground mb-4">{a.description}</p>
                      <p className="mb-6">
                        <strong className="text-foreground">Por que essas roupas? </strong>
                        {a.clothingWhy}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {a.tips.map((t, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground before:content-['🌸'] before:flex-shrink-0">
                            {t}
                          </li>
                        ))}
                      </ul>
                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Preciso de ajuda para escolher presente para criança de ${a.tab} 🎁`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="default" className="bg-green-500 hover:bg-green-600">
                          💬 Me ajude a escolher
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── GALERIA ── */}
      <Gallery />

      {/* ── WHATSAPP CTA ── */}
      <section className="py-14 px-4 sm:py-20 sm:px-8 bg-gradient-to-br from-rose-light to-mint-light">
        <div className="max-w-[600px] mx-auto">
          <Card className="bg-white/90 backdrop-blur-lg border border-brand-border/60 rounded-[28px] p-10 text-center shadow-xl shadow-rose/15">
            <CardContent className="p-0">
              <span className="text-5xl mb-4 block">💬</span>
              <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] text-foreground mb-3">
                Compre pelo WhatsApp
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Atendimento personalizado, tire suas dúvidas, peça fotos dos produtos
                e receba tudo no conforto da sua casa. Simples assim!
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 sm:gap-6 mb-8">
                <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
                  ✅ Atendimento rápido
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
                  🚚 Entrega em domicílio
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-4 rounded-full">
                  🔒 Compra segura
                </Badge>
              </div>
              <WhatsAppButton label="Falar com a loja agora" variant="primary" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── FLOATING WA BUTTON ── */}
      <WhatsAppButton variant="floating" />
    </>
  )
}
