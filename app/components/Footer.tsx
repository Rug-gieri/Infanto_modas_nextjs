import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#fbfaf7] px-5 py-12 text-neutral-900 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-10 border-b border-neutral-200 pb-10 lg:grid lg:grid-cols-[2fr_1fr_1fr_1.5fr] lg:gap-12 lg:pb-12">
          {/* Brand */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Image
              src="/footer_full_logo.png"
              alt="Infanto Modas"
              width={200}
              height={100}
              className="h-auto max-w-[190px] object-contain sm:max-w-[220px]"
            />

            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500 sm:max-w-sm">
              Roupinhas delicadas e cheias de estilo para os pequenos de 0 a 16
              anos. Qualidade, carinho e conforto em cada peça.
            </p>


          </div>

          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 lg:contents lg:text-left">
            <FooterColumn title="Categorias">
              <FooterLink href="#categorias">Bebês</FooterLink>
              <FooterLink href="#categorias">Toddler</FooterLink>
              <FooterLink href="#categorias">Infantil</FooterLink>
              <FooterLink href="#categorias">Juvenil</FooterLink>
              <FooterLink href="#categorias">Festa</FooterLink>
              <FooterLink href="#categorias">Pijamas</FooterLink>
            </FooterColumn>

            <FooterColumn title="Informações">
              <FooterLink href="#">Sobre nós</FooterLink>
              <FooterLink href="#">Como comprar</FooterLink>
              <FooterLink href="#">Trocas</FooterLink>
              <FooterLink href="#">Entrega</FooterLink>
              <FooterLink href="#">Dúvidas</FooterLink>
            </FooterColumn>

            <FooterColumn title="Contato" className="col-span-2 sm:col-span-1">
              <FooterLink href="#">Av. Sete de Setembro 737</FooterLink>
              <FooterLink href="#">(69) 99232-7118</FooterLink>
              <FooterLink href="#">contato@infantomodas.com.br</FooterLink>
              <span className="text-sm text-neutral-400">Seg–Sex: 8h–17h</span>
              <span className="text-sm text-neutral-400">Sáb: 8h–12h</span>
            </FooterColumn>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-6 text-center text-xs text-neutral-400 sm:text-sm lg:flex-row lg:justify-between lg:text-left">
          <p>© {year} Infanto Modas. Todos os direitos reservados.</p>

          <p>
            Feito com carinho —{' '}
            <a href="#" className="text-neutral-600 transition-colors hover:text-neutral-950">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <h4 className="mb-4 text-sm font-semibold tracking-tight text-neutral-950">
        {title}
      </h4>

      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
    >
      {children}
    </a>
  )
}