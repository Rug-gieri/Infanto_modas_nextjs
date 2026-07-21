'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, ShoppingBag, ShoppingCart, Wallet } from 'lucide-react'
import { useCart } from './cart/CartProvider'

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/produtos', label: 'Produtos', icon: ShoppingBag },
  { href: '/carrinho', label: 'Carrinho', icon: ShoppingCart },
  { href: '/checkout', label: 'Checkout', icon: Wallet },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden bg-card rounded-full shadow-xl border border-border/60 w-[calc(100%-2rem)] max-w-sm py-1.5">
      <div className="flex items-center justify-around h-12 sm:h-14 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full no-underline transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="size-5" />
              {item.href === '/carrinho' && itemCount > 0 ? (
                <span className="absolute right-4 top-0 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-deep px-1.5 text-[0.65rem] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
              <span className="text-[0.7rem] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
