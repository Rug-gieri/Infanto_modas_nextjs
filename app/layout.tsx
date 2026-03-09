import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBar from './components/AnnouncementBar';


export const metadata: Metadata = {
  title: 'Infanto Modas | Moda Infantil com Amor',
  description:
    'Roupinhas delicadas e cheias de estilo para os pequenos de 0 a 14 anos. Compre pelo WhatsApp e receba em casa!',
  keywords: 'roupa infantil, moda infantil, bebê, criança, presente infantil',
  icons: {
    icon: '/head_worm_nobg.png',
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="sticky-header">
          <AnnouncementBar />
          <Navbar />
        </div>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
