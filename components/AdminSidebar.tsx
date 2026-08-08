'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, LayoutDashboard, Menu, Package, ShoppingBag, Users } from 'lucide-react'

import AdminLogoutButton from '@/components/AdminLogoutButton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
]

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-5 shrink-0">
        <h1 className="font-display text-lg font-bold text-foreground">Painel Admin</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Infanto Modas</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 space-y-1 border-t border-border shrink-0">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors no-underline"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          Voltar ao site
        </Link>
        <AdminLogoutButton />
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-[240px] bg-background border-r border-border min-h-screen">
        <SidebarContent pathname={pathname} />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-display text-base font-bold text-foreground">Painel Admin</h1>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Menu className="w-5 h-5" />
          </Button>
          <SheetContent side="left" className="w-[260px] p-0">
            <SidebarContent
              pathname={pathname}
              onNavigate={() => {
                setMobileOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
