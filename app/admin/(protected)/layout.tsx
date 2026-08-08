import { redirect } from 'next/navigation'

import AdminSidebar from '@/components/AdminSidebar'
import { getAdminSessionToken } from '@/lib/server/admin-session'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = await getAdminSessionToken()

  if (!token) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 md:pt-0 pt-14">{children}</main>
    </div>
  )
}
