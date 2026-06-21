'use client'

import React, { useState, useCallback, useEffect } from 'react'

interface Slide {
  bg: string
  title: string
  subtitle: string
  buttonText: string
  image: string
}

const slides: Slide[] = [
  {
    bg: '#4A90E2',
    title: 'Pronto para descobrir o mundo!',
    subtitle: 'Looks confortáveis para muitas aventuras',
    buttonText: 'Ver coleção',
    image: '/caminho-da-crianca.png',
  },
  {
    bg: '#E07A92',
    title: 'Puro algodão, puro carinho',
    subtitle: 'Peças que respeitam a pele sensível do bebê',
    buttonText: 'Ver coleção',
    image: '/girl_hero.png',
  },
  {
    bg: '#A8D8C8',
    title: 'Estilo acompanha o crescimento',
    subtitle: 'Dos primeiros passos às primeiras aventuras',
    buttonText: 'Ver coleção',
    image: '/boy_hero.png',
  },
  {
    bg: '#D4A847',
    title: 'Looks inesquecíveis',
    subtitle: 'Batizados, festas e celebrações especiais',
    buttonText: 'Ver coleção',
    image: '/girl_hero2.png',
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStart - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        } else {
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
      }
    },
    [touchStart]
  )

  return (
    <section id="inicio" data-search-root className="py-6 sm:py-8 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="relative min-h-[200px] sm:min-h-[240px] md:min-h-[300px] rounded-[28px] overflow-x-clip overflow-y-visible"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`rounded-[28px] p-6 sm:p-8 md:p-10 text-white absolute inset-0 flex justify-between items-end transition-opacity duration-500 ${
                i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              style={{ backgroundColor: slide.bg }}
            >
              <div className="relative z-10 pb-4 sm:pb-5 max-w-[55%] sm:max-w-[60%]">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-2">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm opacity-90 mb-4">
                  {slide.subtitle}
                </p>
                <a href="#destaques">
                  <button className="bg-[#F9F6F0] text-[#093566] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:brightness-95 transition">
                    {slide.buttonText}
                  </button>
                </a>
              </div>
              <img
                src={slide.image}
                className="absolute right-4 sm:right-4 md:right-6 -bottom-0 sm:-bottom-0 h-[110%] sm:h-[140%] md:h-[110%] max-w-none object-contain object-bottom z-20 pointer-events-none"
                alt="Modelo Infantil Infanto Modas"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'bg-rose-deep w-6'
                  : 'bg-rose-deep/30 w-2.5'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
