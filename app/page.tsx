'use client'

import React, { useState, useEffect } from 'react'
import WhatsAppButton from './components/WhatsAppButton'
import HeroCarousel from './components/HeroCarousel'
import { Card, CardContent } from '@/components/ui/card'
import Destaques from './components/Destaques'

const WHATSAPP = '556992228016'

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

  return (
    <>
      <HeroCarousel />

      <Destaques />

      {/* ── GUIA POR IDADE ──
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
      </section> */}

      {/* ── GALERIA ── */}


      {/* ── WHATSAPP CTA ── */}
      <section className="bg-[#F7F7F8] px-6 py-24">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-6 md:gap-8 itens-stretch">
          <Card className=" h-full flex flex-col justify-center rounded-[32px] border border-black/5 bg-white shadow-sm">
            <CardContent className="flex-1 flex flex-col justify-center px-8 py-16 sm:px-14 sm:py-20 text-center">

              <h2 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl">
                Compre sem sair de casa.
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-500">
                Fale conosco pelo WhatsApp, receba atendimento personalizado
                e tenha seus produtos entregues onde estiver.
              </p>

              <div className="mt-12 flex justify-center">
                <WhatsAppButton
                  label="Conversar no WhatsApp"
                  variant="primary"
                />
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-400">
                <span>Atendimento rápido</span>

                <span className="h-1 w-1 rounded-full bg-neutral-300" />

                <span>Compra segura</span>

                <span className="h-1 w-1 rounded-full bg-neutral-300" />

                <span>Entrega no mesmo dia</span>
              </div>

            </CardContent>
          </Card>

          <Card className="h-full rounded-[32px] border border-black/5 bg-white shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="px-8 py-12 sm:px-10 sm:py-16">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Onde estamos
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827] sm:text-3xl">
                  Venha nos conhecer
                </h3>
                <p className="mt-4 text-base leading-7 text-neutral-500">
                  Rua José Bonifácio, 3067<br />
                  Centro, Porto Velho - RO<br />
                  76801-094
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-neutral-400">
                  <span>Seg–Sex: 08:00–18:00</span>
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  <span>Sáb: 08:00–13:00</span>
                </div>
              </div>
              <div className="relative min-h-[280px] md:min-h-full p-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.226166325062!2d-63.9034323!3d-8.764779699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92325cdc5d2b75ff%3A0xb3c5d956f6a5fbd0!2sInfanto%20Modas!5e0!3m2!1spt-BR!2sbr!4v1782085354746!5m2!1spt-BR!2sbr"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Infanto Modas"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ── FLOATING WA BUTTON ── */}
      {/* <WhatsAppButton variant="floating" /> */}
    </>
  )
}
