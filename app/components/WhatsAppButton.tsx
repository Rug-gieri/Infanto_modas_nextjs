interface WhatsAppButtonProps {
  label?: string
  message?: string
  phone?: string
  variant?: 'primary' | 'floating'
}

const WHATSAPP_NUMBER = '5500000000000' // ← substitua pelo número real

export default function WhatsAppButton({
  label = 'Compre pelo WhatsApp',
  message = 'Olá! Vim pelo site e gostaria de saber mais sobre as roupinhas 💗',
  phone = WHATSAPP_NUMBER,
  variant = 'primary',
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 99,
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.7rem',
          boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
          textDecoration: 'none',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          animation: 'floatWA 3s ease-in-out infinite',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
        }}
      >
        💬
        <style>{`
          @keyframes floatWA {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}</style>
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-whatsapp"
    >
      💬 {label}
    </a>
  )
}
