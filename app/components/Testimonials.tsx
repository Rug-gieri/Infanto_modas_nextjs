import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    stars: 5,
    text: 'As roupinhas chegaram rapidinho e são ainda mais lindas do que na foto! Minha filha amou o vestidinho, ficou um charme. Com certeza vou comprar mais!',
    name: 'Camila S.',
    info: 'Mãe da Sofia, 3 anos',
    emoji: '👩',
  },
  {
    stars: 5,
    text: 'Atendimento incrível pelo WhatsApp! Me ajudaram a escolher o tamanho certo e o presente chegou no prazo. Qualidade das peças é excelente, superou as expectativas.',
    name: 'Fernanda M.',
    info: 'Mãe do Lucas, 1 ano e 4 meses',
    emoji: '👩‍🦱',
  },
  {
    stars: 5,
    text: 'Comprei um conjunto para o aniversário da minha sobrinha e todos perguntaram onde foi comprado. Voltei no dia seguinte para comprar mais peças!',
    name: 'Renata L.',
    info: 'Tia da Beatriz, 5 anos',
    emoji: '👩‍🦰',
  },
  {
    stars: 5,
    text: 'Sempre compro aqui! As peças têm ótimo custo-benefício, são confortáveis e duráveis. Meu filho usa, brinca, corre — e a roupa aguenta tudo!',
    name: 'Juliana P.',
    info: 'Mãe do Pedro, 7 anos',
    emoji: '👩‍🦳',
  },
  {
    stars: 5,
    text: 'Fiz minha primeira compra com um pouco de receio por ser online, mas me surpreendi! Embalagem caprichada, nota fiscal e roupa de qualidade. Recomendo muito!',
    name: 'Alessandra T.',
    info: 'Mãe da Isadora, 2 anos',
    emoji: '🙋‍♀️',
  },
  {
    stars: 5,
    text: 'A variedade de marcas é incrível. Consigo encontrar desde o básico do dia a dia até peças mais especiais para festinhas. Minha loja favorita!',
    name: 'Patrícia C.',
    info: 'Mãe de 3 filhos',
    emoji: '👩‍👧‍👦',
  },
]

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-14 px-4 sm:py-20 sm:px-8 bg-warm-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-rose-deep font-bold text-[0.7rem] sm:text-xs uppercase tracking-[0.15em] mb-3">Depoimentos</span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-3 leading-tight">O que as mamães dizem 💗</h2>
          <p className="text-muted-foreground max-w-[520px] mx-auto">
            Mais de 500 famílias já confiaram na Infanto Modas. Veja o que elas
            têm a dizer!
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="relative border-brand-border bg-white rounded-[20px] p-7 transition-all hover:border-rose hover:shadow-lg hover:shadow-rose/20 hover:-translate-y-[3px] before:content-['\201C'] before:font-display before:text-[5rem] before:text-rose-light before:absolute before:top-2 before:right-5 before:leading-none"
            >
              <CardContent className="p-0">
                <div className="text-gold text-base mb-4 tracking-[2px]">
                  {'★'.repeat(t.stars)}
                </div>
                <p className="text-[0.93rem] text-foreground mb-5 leading-relaxed italic">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-gradient-to-br from-rose-light to-mint-light">
                    {t.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-[0.9rem] text-foreground">{t.name}</div>
                    <div className="text-[0.78rem] text-muted-foreground">{t.info}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
