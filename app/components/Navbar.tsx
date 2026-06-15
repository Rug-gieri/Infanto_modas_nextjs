'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const WHATSAPP_NUMBER = '5569992327118'

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Categorias', href: '#categorias' },
  { label: 'Destaques', href: '#destaques' },
  { label: 'Por Idade', href: '#por-idade' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Cadastro', href: '#cadastro' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
    <nav className="sticky top-0 z-50 flex h-[82px] items-center justify-between border-b border-brand-border bg-warm-white/90 backdrop-blur-xl px-6 shadow-md">
      {/* Logo */}
      <a href="#inicio" className="flex items-center gap-3 no-underline ml-1">
        <Image
          src="/nobg_blink.png"
          alt="infanto modas em texto"
          width={60}
          height={48}
        />
        <div className="hidden sm:flex">
          <Image
            src="/infanto_text_logo.png"
            alt="infanto modas em texto"
            width={150}
            height={48}
          />
        </div>
      </a>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        {navLinks.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="relative text-[0.9rem] font-semibold text-soft-gray no-underline transition-colors hover:text-rose-deep after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:w-0 after:rounded-sm after:bg-rose after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex"
          >
            <Button
              size="sm"
              className="rounded-full bg-rose-deep text-primary-foreground hover:bg-charcoal"
            >
              💬 Comprar
            </Button>
          </a>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-1"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <span className="block w-6 h-[2px] bg-charcoal rounded-sm" />
        <span className="block w-6 h-[2px] bg-charcoal rounded-sm" />
        <span className="block w-6 h-[2px] bg-charcoal rounded-sm" />
      </button>

    </nav>

    {/* Sheet — outside nav to avoid flex layout interference */}
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[80%] max-w-[320px] flex flex-col gap-6">
        <SheetHeader className="text-left">
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-charcoal">
              Infanto Modas
            </span>
            <span className="text-[0.7rem] font-medium tracking-wider uppercase text-rose-deep">
              Moda Infantil com Amor ✨
            </span>
          </div>
        </SheetHeader>
        <ul className="list-none flex flex-col">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3.5 border-b border-brand-border text-base font-semibold text-charcoal no-underline transition-colors hover:text-rose-deep"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          <Button
            variant="default"
            className="w-full bg-green-500 hover:bg-green-600"
          >
            💬 Comprar pelo WhatsApp
          </Button>
        </a>
      </SheetContent>
    </Sheet>
    </>
  )
}
