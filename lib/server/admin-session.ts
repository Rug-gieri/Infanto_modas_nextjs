import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { adminCookieOptions, ADMIN_TOKEN_COOKIE } from '@/lib/server/admin-auth'

export async function getAdminSessionToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value || ''

  return token && token === process.env.ADMIN_SECRET ? token : null
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Sessao expirada.' }, { status: 401 })
}

export function withUnauthorizedCookieCleanup(response: NextResponse, status: number) {
  if (status === 401) {
    response.cookies.set(ADMIN_TOKEN_COOKIE, '', { ...adminCookieOptions, maxAge: 0 })
  }

  return response
}
