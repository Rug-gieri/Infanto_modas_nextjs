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
    <section id="depoimentos" className="section testimonials-section">
      <div className="section-inner">
        <div className="section-header centered">
          <span className="section-label">Depoimentos</span>
          <h2 className="section-title">O que as mamães dizem 💗</h2>
          <p className="section-subtitle">
            Mais de 500 famílias já confiaram na Infanto Modas. Veja o que elas
            têm a dizer!
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">
                {'★'.repeat(t.stars)}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.emoji}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-info">{t.info}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
