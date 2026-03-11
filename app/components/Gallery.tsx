import Image from 'next/image';

// Fotos originais em /public
const photos = [
  { image: '/conjunto_menino_green.jpg', label: 'Conjunto Verde', bg: 'linear-gradient(160deg,#FDE8EE,#F7C5D3)' },
  { image: '/conjunto_menino_lightblue.jpg', label: 'Conjunto Azul Claro', bg: 'linear-gradient(135deg,#E4F5F0,#C8EDE3)' },
  { image: '/conjunto_menino_red.jpg', label: 'Conjunto Vermelho', bg: 'linear-gradient(135deg,#FDF8F3,#F0E4E8)' },
  { image: '/trico_branco.jpg', label: 'Tricô Branco', bg: 'linear-gradient(135deg,#E4F5F0,#D4EDF8)' },
  { image: '/trico_branco2.jpg', label: 'Tricô Branco Detalhes', bg: 'linear-gradient(135deg,#FDE8EE,#F0E4E8)' },
  { image: '/conjunto_feminino_pink.jpg', label: 'Coleção Infantil', bg: 'linear-gradient(135deg,#FDF8F3,#E4F5F0)' },
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
              style={{ background: p.bg, position: 'relative', overflow: 'hidden' }}
              title={p.label}
            >
              <Image src={p.image} alt={p.label} fill style={{ objectFit: 'cover' }} />
              <div className="gallery-overlay" style={{ zIndex: 1, pointerEvents: 'none' }} />
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
