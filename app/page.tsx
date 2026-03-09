'use client'

import { useState } from 'react'
import WhatsAppButton from './components/WhatsAppButton'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Image from 'next/image';


// ─── DATA ───────────────────────────────────────────────────────────────────

const WHATSAPP = '5569992327118' // ← substitua

const categories = [
  { icon: '🍼', name: 'Bebês', desc: '0 – 2 anos', href: '#' },
  { icon: '🧸', name: 'Toddler', desc: '2 – 4 anos', href: '#' },
  { icon: '🌈', name: 'Infantil', desc: '4 – 8 anos', href: '#' },
  { icon: '⭐', name: 'Juvenil', desc: '8 – 14 anos', href: '#' },
  { icon: '🎀', name: 'Festa', desc: 'Ocasiões especiais', href: '#' },
  { icon: '🌙', name: 'Pijamas', desc: 'Dormir com estilo', href: '#' },
]

const brands = [
  { name: 'Milon', emoji: '✨' },
  { name: 'Carinhoso', emoji: '💗' },
  { name: 'Kyly', emoji: '🌸' },
  { name: 'Tip Top', emoji: '🍼' },
  { name: 'Brandili', emoji: '🌟' },
  { name: 'Alakazoo', emoji: '🎨' },
  { name: 'Kely & Kety', emoji: '🦋' },
  { name: 'Kukie', emoji: '🧸' },
  { name: 'Alphabeto', emoji: '📚' },
  { name: 'Puket', emoji: '🌙' },
]

const highlights = [
  {
    emoji: '🌸',
    badge: 'Novo',
    name: 'Vestido Primavera',
    age: 'Para 2 a 6 anos',
    bg: 'linear-gradient(135deg,#FDE8EE,#F7C5D3)',
  },
  {
    emoji: '🧸',
    badge: 'Mais vendido',
    name: 'Conjunto Bebê Ursinho',
    age: 'Para 0 a 18 meses',
    bg: 'linear-gradient(135deg,#E4F5F0,#C8EDE3)',
  },
  {
    emoji: '⭐',
    badge: 'Destaque',
    name: 'Body Manga Longa',
    age: 'Para 0 a 12 meses',
    bg: 'linear-gradient(135deg,#FDF8F3,#F0E4E8)',
  },
  {
    emoji: '🎀',
    badge: 'Festa',
    name: 'Vestido de Festa Rosa',
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

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeAge, setActiveAge] = useState(0)
  const doubled = [...brands, ...brands]

  return (
    <>
      {/* ── HERO ── */}
      <section data-search-root id="inicio" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🌸</span> Porque seu filho merece o melhor!
            </div>
            <h1 className="hero-title">
              Roupinhas que contam{' '}
              <em>histórias de infância</em>
            </h1>
            <p className="hero-subtitle">
              De 0 a 16 anos, cada peça é escolhida com carinho para vestir os
              pequenos com conforto, qualidade e muito estilo. Compre pelo
              WhatsApp e receba em casa! 💗
            </p>
            <div className="hero-actions">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de ver as roupinhas 💗')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                💬 Comprar agora
              </a>
              <a href="#categorias" className="btn btn-secondary">
                Ver categorias ↓
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-floating-pill pill-1">⭐ +500 famílias</div>
            <div className="hero-floating-pill pill-2">🚚 Entrega em casa</div>
            <div className="hero-image-frame">

              <Image className="hero-image" src="/main_img.jpg" alt="mãe vestindo o filho" width={430} height={450} />

            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section id="categorias" className="section" style={{ background: 'var(--warm-white)' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">O que você procura?</span>
            <h2 className="section-title">Nossas categorias</h2>
            <p className="section-subtitle">
              Do bebezinho ao juvenil, temos tudo que os pequenos precisam em
              cada fase da vida.
            </p>
          </div>
          <div className="categories-grid">
            {categories.map((c) => (
              <a key={c.name} href={c.href} className="category-card">
                <span className="category-icon">{c.icon}</span>
                <div className="category-name">{c.name}</div>
                <div className="category-desc">{c.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARCAS ── */}
      <section className="section brands-section">
        <div className="section-inner" style={{ marginBottom: '2rem' }}>
          <div className="section-header centered">
            <span className="section-label">Trabalhamos com</span>
            <h2 className="section-title">Marcas que a gente ama 🏷️</h2>
          </div>
        </div>
        <div className="brands-track-wrapper">
          <div className="brands-track">
            {doubled.map((b, i) => (
              <div key={i} className="brand-chip">
                <span>{b.emoji}</span> {b.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTAQUES ── */}
      <section id="destaques" className="section" style={{ background: 'var(--cream)' }}>
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Peças em destaque</span>
            <h2 className="section-title">As queridinhas do momento ✨</h2>
            <p className="section-subtitle">
              Peças selecionadas com muito carinho que estão fazendo sucesso com
              os pequenos.
            </p>
          </div>
          <div className="highlights-grid">
            {highlights.map((p, i) => (
              <div key={i} className="product-card">
                <div className="product-image" style={{ background: p.bg }}>
                  <span style={{ fontSize: '4rem' }}>{p.emoji}</span>
                  <span className="product-badge">{p.badge}</span>
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-age">{p.age}</div>
                  <div className="product-footer">
                    <span className="product-price">Consulte valor 💬</span>
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${p.name} 💗`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                    >
                      💬 Pedir
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUIA POR IDADE ── */}
      <section id="por-idade" className="section age-guide">
        <div className="section-inner">
          <div className="section-header centered">
            <span className="section-label">Guia de presente por idade</span>
            <h2 className="section-title">O que dar de presente? 🎁</h2>
            <p className="section-subtitle">
              Cada fase da infância tem suas necessidades e encantamentos únicos.
              Escolha o presente ideal para cada idade.
            </p>
          </div>

          {/* Tabs */}
          <div className="age-tabs">
            {ageGuide.map((a, i) => (
              <button
                key={i}
                className={`age-tab ${activeAge === i ? 'active' : ''}`}
                onClick={() => setActiveAge(i)}
              >
                {a.tab}
              </button>
            ))}
          </div>

          {/* Panels */}
          {ageGuide.map((a, i) => (
            <div
              key={i}
              className={`age-panel ${activeAge === i ? 'active' : ''}`}
            >
              <div className="age-panel-emoji">{a.emoji}</div>
              <div className="age-panel-content">
                <span className="age-phase">
                  {a.label} · {a.phase}
                </span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <p>
                  <strong>Por que essas roupas? </strong>
                  {a.clothingWhy}
                </p>
                <ul className="age-tips">
                  {a.tips.map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
                <div style={{ marginTop: '1.5rem' }}>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Preciso de ajuda para escolher presente para criança de ${a.tab} 🎁`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    💬 Me ajude a escolher
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALERIA ── */}
      <Gallery />

      {/* ── WHATSAPP CTA ── */}
      <section className="whatsapp-section">
        <div className="whatsapp-card">
          <span className="whatsapp-icon">💬</span>
          <h2>Compre pelo WhatsApp</h2>
          <p>
            Atendimento personalizado, tire suas dúvidas, peça fotos dos produtos
            e receba tudo no conforto da sua casa. Simples assim!
          </p>
          <div className="whatsapp-features">
            <div className="whatsapp-feature">✅ Atendimento rápido</div>
            <div className="whatsapp-feature">🚚 Entrega em domicílio</div>
            <div className="whatsapp-feature">🔒 Compra segura</div>
          </div>
          <WhatsAppButton label="Falar com a loja agora" variant="primary" />
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <Testimonials />

      {/* ── FLOATING WA BUTTON ── */}
      <WhatsAppButton variant="floating" />
    </>
  )
}
