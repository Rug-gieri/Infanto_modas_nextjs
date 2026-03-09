'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = '5569992327118' // ← substitua pelo número real

const navLinks = [
  { label: 'Início', href: '#inicio' },
  { label: 'Categorias', href: '#categorias' },
  { label: 'Destaques', href: '#destaques' },
  { label: 'Por Idade', href: '#por-idade' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Depoimentos', href: '#depoimentos' },
]

import Image from 'next/image'; //importação obrigatória
import logo from '../public/head_worm_nobg.png'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className="navbar">
        {/* LOGO — substitua a div .logo-placeholder pela sua tag <Image> do Next.js */}
        <a href="#inicio" className="navbar-logo">
          <div className="logo-placeholder">
            <Image src="/head_worm_nobg.png" alt="Infanto Modas logo" width={48} height={48} />
          </div>
          <div className="logo-text">
            <Image src="/infanto_text_logo.png" alt="infanto modas em texto" width={150} height={48} />
          </div>
        </a>

        {/* Links desktop */}
        <ul className="navbar-links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-cta"
            >
              💬 Comprar
            </a>
          </li>
        </ul>

        {/* Hamburger mobile */}
        <button
          className="hamburger"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-overlay" onClick={close} />
        <div className="mobile-menu-panel">
          <button className="mobile-close" onClick={close} aria-label="Fechar menu">
            ✕
          </button>
          <div className="logo-text">
            <span className="logo-name">Infanto Modas</span>
            <span className="logo-tagline">Moda Infantil com Amor ✨</span>
          </div>
          <ul className="mobile-nav-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ marginTop: 'auto' }}
          >
            💬 Comprar pelo WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
