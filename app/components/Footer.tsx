import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-footer text-black/70 py-8 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center text-center">
            <Image
              src="/footer_full_logo.png"
              alt="Nova Logo"
              width={240}
              height={120}
              className="drop-shadow-md object-contain max-w-full h-auto"
            />
            <p className="text-sm leading-relaxed mt-4">
              Roupinhas delicadas e cheias de estilo para os pequenos de 0 a 16
              anos. Qualidade, carinho e conforto em cada peça.
            </p>
            <div className="flex justify-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/lojainfantomodas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-lg no-underline transition-all hover:bg-rose-deep hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                📸
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-lg no-underline transition-all hover:bg-rose-deep hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                💙
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-lg no-underline transition-all hover:bg-rose-deep hover:-translate-y-0.5"
                aria-label="WhatsApp"
              >
                💬
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-lg no-underline transition-all hover:bg-rose-deep hover:-translate-y-0.5"
                aria-label="TikTok"
              >
                🎵
              </a>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-display text-[rgb(10,84,19)] text-[1.05rem] mb-5">Categorias</h4>
            <ul className="list-none flex flex-col gap-2.5">
              <li><a href="#categorias" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Bebês (0–2 anos)</a></li>
              <li><a href="#categorias" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Toddler (2–4 anos)</a></li>
              <li><a href="#categorias" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Infantil (4–8 anos)</a></li>
              <li><a href="#categorias" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Juvenil (8–14 anos)</a></li>
              <li><a href="#categorias" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Festa & Ocasiões</a></li>
              <li><a href="#categorias" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Pijamas</a></li>
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h4 className="font-display text-[rgb(10,84,19)] text-[1.05rem] mb-5">Informações</h4>
            <ul className="list-none flex flex-col gap-2.5">
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Sobre nós</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Como comprar</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Trocas e devoluções</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Política de entrega</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">Perguntas frequentes</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display text-[rgb(10,84,19)] text-[1.05rem] mb-5">Contato</h4>
            <ul className="list-none flex flex-col gap-2.5">
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">📍  Av. Sete de Setembro 737, Porto Velho</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">📞 (69) 99232-7118</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">✉️ contato@infantomodas.com.br</a></li>
              <li className="mt-2"><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">⏰ Seg–Sex: 8h–17h</a></li>
              <li><a href="#" className="text-black/60 text-sm no-underline transition-colors hover:text-rose">⏰ Sáb: 8h–12h</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex justify-between items-center flex-wrap gap-4">
          <p className="text-[0.82rem]">© {year} Infanto Modas. Todos os direitos reservados.</p>
          <p className="text-[0.82rem]">
            Feito com 💗 para os pequenos —{' '}
            <a href="#" className="text-black no-underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
