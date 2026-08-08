import { redirect } from 'next/navigation'

import { getAdminSessionToken } from '@/lib/server/admin-session'

export default async function AdminHome() {
  const token = await getAdminSessionToken()

  redirect(token ? '/admin/dashboard' : '/admin/login')
}
