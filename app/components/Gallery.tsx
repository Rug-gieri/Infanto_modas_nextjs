// Substitua os emojis por <Image> do Next.js com suas fotos reais
const photos = [
  { emoji: '👗', label: 'Vestidos de festa', bg: 'linear-gradient(160deg,#FDE8EE,#F7C5D3)' },
  { emoji: '🧸', label: 'Conjuntos bebê', bg: 'linear-gradient(135deg,#E4F5F0,#C8EDE3)' },
  { emoji: '👟', label: 'Looks casuais', bg: 'linear-gradient(135deg,#FDF8F3,#F0E4E8)' },
  { emoji: '🎀', label: 'Acessórios', bg: 'linear-gradient(135deg,#E4F5F0,#D4EDF8)' },
  { emoji: '🌸', label: 'Coleção primavera', bg: 'linear-gradient(135deg,#FDE8EE,#F0E4E8)' },
  { emoji: '⭐', label: 'Destaque da semana', bg: 'linear-gradient(135deg,#FDF8F3,#E4F5F0)' },
]

export default function Gallery() {
  return (
    <section id="galeria" className="section">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-label">Nossa galeria</span>
          <h2 className="section-title">Roupinhas que encantam 🌸</h2>
          <p className="section-subtitle">
            Cada peça é escolhida com cuidado para deixar os pequenos ainda mais
            fofos e confortáveis no dia a dia.
          </p>
        </div>

        <div className="gallery-grid">
          {photos.map((p, i) => (
            <div
              key={i}
              className="gallery-item"
              style={{ background: p.bg }}
              title={p.label}
            >
              <span style={{ fontSize: i === 0 ? '5rem' : '3rem' }}>{p.emoji}</span>
              <div className="gallery-overlay" />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a
            href="https://www.instagram.com/lojainfantomodas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            📸 Ver mais no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
