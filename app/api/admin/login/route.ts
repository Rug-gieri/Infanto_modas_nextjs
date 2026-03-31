import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { senha } = await req.json()

    if (!senha) {
      return NextResponse.json({ error: 'Senha é obrigatória.' }, { status: 400 })
    }

    if (senha !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 })
    }

    return NextResponse.json({ token: process.env.ADMIN_SECRET })
  } catch (err) {
    console.error('Erro no login admin:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
