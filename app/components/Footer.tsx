import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          marginBottom: '0.2rem'
        }}>
          <Image
            src="/nova_logo.svg"
            alt="Nova Logo"
            width={200}
            height={200}
            className="footer-logo-img"
            style={{ filter: 'drop-shadow(0 6px 12px rgba(254, 254, 254, 0.15))' }}
          />
        </div>
        <div className="footer-grid">
          {/* Marca */}

          <div className="footer-brand" style={{ textAlign: 'center', justifyContent: 'center' }}>
            <p>
              Roupinhas delicadas e cheias de estilo para os pequenos de 0 a 16
              anos. Qualidade, carinho e conforto em cada peça.
            </p>
            <div className="footer-social" style={{}}>
              <a href="https://www.instagram.com/lojainfantomodas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="social-btn" aria-label="Instagram">📸</a>
              <a href="#" className="social-btn" aria-label="Facebook">💙</a>
              <a href="#" className="social-btn" aria-label="WhatsApp">💬</a>
              <a href="#" className="social-btn" aria-label="TikTok">🎵</a>
            </div>
          </div>

          {/* Categorias */}
          <div className="footer-col">
            <h4>Categorias</h4>
            <ul>
              <li><a href="#categorias">Bebês (0–2 anos)</a></li>
              <li><a href="#categorias">Toddler (2–4 anos)</a></li>
              <li><a href="#categorias">Infantil (4–8 anos)</a></li>
              <li><a href="#categorias">Juvenil (8–14 anos)</a></li>
              <li><a href="#categorias">Festa & Ocasiões</a></li>
              <li><a href="#categorias">Pijamas</a></li>
            </ul>
          </div>

          {/* Informações */}
          <div className="footer-col">
            <h4>Informações</h4>
            <ul>
              <li><a href="#">Sobre nós</a></li>
              <li><a href="#">Como comprar</a></li>
              <li><a href="#">Trocas e devoluções</a></li>
              <li><a href="#">Política de entrega</a></li>
              <li><a href="#">Perguntas frequentes</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li><a href="#">📍  Av. Sete de Setembro 737, Porto Velho</a></li>
              <li><a href="#">📞 (69) 99232-7118</a></li>
              <li><a href="#">✉️ contato@infantomodas.com.br</a></li>
              <li style={{ marginTop: '0.5rem' }}>
                <a href="#">⏰ Seg–Sex: 8h–17h</a>
              </li>
              <li><a href="#">⏰ Sáb: 8h–12h</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Infanto Modas. Todos os direitos reservados.</p>
          <p>
            Feito com 💗 para os pequenos <a href="rethinksotware.com.br">RethinkSoftware.com.br</a>—{' '}
            <a href="#">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
