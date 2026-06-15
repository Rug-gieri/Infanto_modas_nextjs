import Image from 'next/image'
import { Button } from '@/components/ui/button'

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
    <section id="galeria" className="py-14 px-4 sm:py-20 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8 sm:mb-12">
          <span className="inline-block text-rose-deep font-bold text-[0.7rem] sm:text-xs uppercase tracking-[0.15em] mb-3">Nossa galeria</span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] text-foreground mb-3 leading-tight">Roupinhas que encantam 🌸</h2>
          <p className="text-muted-foreground max-w-[520px]">
            Cada peça é escolhida com cuidado para deixar os pequenos ainda mais
            fofos e confortáveis no dia a dia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[220px] [&>*:nth-child(1)]:md:row-span-2 [&>*:nth-child(4)]:md:col-span-2">
          {photos.map((p, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-rose/30"
              style={{ background: p.bg }}
              title={p.label}
            >
              <Image src={p.image} alt={p.label} fill className="object-cover" />
              <div className="absolute inset-0 bg-transparent transition-colors hover:bg-black/15 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/lojainfantomodas?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              📸 Ver mais no Instagram
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
