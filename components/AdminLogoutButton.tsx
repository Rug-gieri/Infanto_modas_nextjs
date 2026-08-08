'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { logoutAdmin } from '@/lib/services/auth'

export default function AdminLogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logoutAdmin().catch(() => undefined)
      router.replace('/admin/login')
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left disabled:opacity-70"
    >
      <LogOut className="w-5 h-5 shrink-0" />
      {isPending ? 'Saindo...' : 'Sair'}
    </button>
  )
}
