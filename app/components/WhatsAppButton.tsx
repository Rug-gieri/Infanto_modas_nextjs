import { Button } from '@/components/ui/button'

interface WhatsAppButtonProps {
  label?: string
  message?: string
  phone?: string
  variant?: 'primary' | 'floating'
}

const WHATSAPP_NUMBER = '5569992327118'

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
        className="fixed bottom-6 right-6 z-[99] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#25D366] text-[1.7rem] shadow-lg shadow-green-500/50 no-underline transition-transform duration-300 hover:scale-110 animate-float-wa"
      >
        💬
      </a>
    )
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button variant="default" className="bg-green-500 hover:bg-green-600">
        💬 {label}
      </Button>
    </a>
  )
}
