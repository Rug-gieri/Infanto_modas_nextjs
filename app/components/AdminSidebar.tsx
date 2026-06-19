'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Package, ShoppingBag, LogOut, ArrowLeft, Menu } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
]

interface AdminSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  onLogout: () => void
}

function SidebarContent({ activeSection, onNavigate, onLogout }: AdminSidebarProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-5 shrink-0">
        <h1 className="font-display text-lg font-bold text-foreground">Painel Admin</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Infanto Modas</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-3 space-y-1 border-t border-border shrink-0">
        <a
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors no-underline"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          Voltar ao site
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sair
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar({ activeSection, onNavigate, onLogout }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-[240px] bg-background border-r border-border min-h-screen">
        <SidebarContent
          activeSection={activeSection}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-display text-base font-bold text-foreground">Painel Admin</h1>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
            <Menu className="w-5 h-5" />
          </Button>
          <SheetContent side="left" className="w-[260px] p-0">
            <SidebarContent
              activeSection={activeSection}
              onNavigate={(section) => {
                onNavigate(section)
                setMobileOpen(false)
              }}
              onLogout={onLogout}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
