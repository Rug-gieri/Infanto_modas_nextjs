'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/produtos', label: 'Produtos', icon: ShoppingBag },
  { href: '#', label: 'Carrinho', icon: ShoppingCart },
  { href: '/conta', label: 'Conta', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

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
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full no-underline transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="size-5" />
              <span className="text-[0.7rem] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
