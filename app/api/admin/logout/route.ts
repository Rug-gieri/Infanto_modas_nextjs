import { NextResponse } from 'next/server'

import { adminCookieOptions, ADMIN_TOKEN_COOKIE } from '@/lib/server/admin-auth'

export async function POST() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(ADMIN_TOKEN_COOKIE, '', { ...adminCookieOptions, maxAge: 0 })
  return response
}
