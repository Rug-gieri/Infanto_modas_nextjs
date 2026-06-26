import { NextRequest, NextResponse } from 'next/server'
import { handleCorsOptions, jsonWithCors } from '../../../lib/cors'

export function OPTIONS(req: NextRequest) {
  return handleCorsOptions(req)
}

export async function POST(req: NextRequest) {
  try {
    const { senha } = await req.json()

    if (!senha) {
      return jsonWithCors(req, { error: 'Senha é obrigatória.' }, { status: 400 })
    }

    if (senha !== process.env.ADMIN_SECRET) {
      return jsonWithCors(req, { error: 'Senha incorreta.' }, { status: 401 })
    }

    return jsonWithCors(req, { token: process.env.ADMIN_SECRET })
  } catch (err) {
    console.error('Erro no login admin:', err)
    return jsonWithCors(req, { error: 'Erro interno.' }, { status: 500 })
  }
}
