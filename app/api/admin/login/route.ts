import { NextRequest, NextResponse } from 'next/server'

import { adminCookieOptions, ADMIN_TOKEN_COOKIE } from '@/lib/server/admin-auth'

export async function POST(request: NextRequest) {
  const { senha } = await request.json()

  if (!senha) {
    return NextResponse.json({ error: 'Senha é obrigatória.' }, { status: 400 })
  }

  if (senha !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
  }

  const nextResponse = NextResponse.json({ authenticated: true })
  nextResponse.cookies.set(ADMIN_TOKEN_COOKIE, senha, adminCookieOptions)
  return nextResponse
}
