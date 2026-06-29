import Link from 'next/link'

const AnnouncementBar = () => {
  const whatsappUrl = "https://wa.me/556992228016?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20frete%20grátis%20em%20Porto%20Velho."

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-black text-white py-2 px-6 transition-colors no-underline hover:bg-gray-800"
    >
      <div className="w-full max-w-[1536px] mx-auto text-center text-sm font-medium md:text-base">
        Frete grátis na primeira compra para toda Porto Velho*
        <span className="ml-2 underline text-xs opacity-80">Saiba mais</span>
      </div>
    </Link>
  )
}

export default AnnouncementBar
