import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnnouncementBar from '../components/AnnouncementBar'
import BottomNav from '../components/BottomNav'
import { CartProvider } from '../components/cart/CartProvider'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="theme-main">
      <CartProvider>
        <AnnouncementBar />
        <Navbar />
        <main className="pb-24 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </CartProvider>
    </div>
  )
}
